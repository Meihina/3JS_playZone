import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import * as TWEEN from '@tweenjs/tween.js';

import Base, { sceneType, cameraType } from './base';

enum EMoveWayType {
    POSITIVE = 'positive',
    NEGATIVE = 'negative'
}

enum EShapeType {
    BOX = 'box',
    CYLINDER = 'Cylinder'
}

enum EMoveAxleType {
    X,
    Z
}

type TMeshMaterial =
    THREE.Mesh<
        THREE.BoxGeometry | THREE.CylinderGeometry,
        THREE.MeshNormalMaterial | THREE.MeshLambertMaterial | THREE.ShaderMaterial
    >

interface IItem {
    mesh: TMeshMaterial,
    body: CANNON.Body
}

interface IItemCollide {
    [key: number]: boolean,
    id?: boolean,
}

interface IItemKillingPro {
    [key: number]: any,
    id?: any,
}

const defaultMaterialArg = {
    color: 'rgb(250, 250, 250)',
    emissive: 'rgb(0, 0, 250)',
    emissiveIntensity: 2
};

export default class Doodle extends Base {
    // 基础参数
    isStart = false;
    isFailed = false;
    defaultHp = 3;
    curHp = 3;
    score = 0;

    // 移动相关参数
    maxMoveDistance = 60;
    moveAxle: EMoveAxleType = EMoveAxleType.Z;
    moveWay: EMoveWayType = EMoveWayType.POSITIVE;
    curItemMovement: TWEEN.Tween<THREE.Vector3> | null = null;
    isItemMoving = false;

    // 默认tower参数
    baseTowerSize = { x: 50, y: 160, z: 50 };
    baseY = this.baseTowerSize.y;
    baseTowerMesh: TMeshMaterial | null = null;
    baseTowerbody: CANNON.Body | null = null;

    // 积木相关列表
    itemList: IItem[] = [];
    itemCollideList: IItemCollide = {};
    itemKillingProgress: IItemKillingPro = {};

    // 当前积木参数
    curItem: IItem | null = null;
    curItemNum = 0;
    defaultInitItemBoxSize = { x: 55, y: 10, z: 55 };
    defaultInitItemCylinderSize = { rt: 30, rb: 30, h: 10, sg: 240 };
    curInitDiffHeight = 30;

    // 着色器相关
    uniforms: any = {
        u_time: {
            value: 0
        },
        u_resolution: {
            value: new THREE.Vector2(
                this.container?.clientWidth,
                this.container?.clientHeight
            )
        }
    }

    init (): void {
        this.sceneInit(sceneType.PHYSI);
        this.lightInit({ x: 150, y: 300, z: 75 });
        this.cameraInit(
            cameraType.PerspectiveCamera,
            { x: 350, y: 350, z: 350 },
            { x: 0, y: 25, z: 0 }
        );
        this.clockInit();
        this.rendererInit();
        this.controlsInit();
        this.controls.maxPolarAngle = Math.PI / 2 - 0.01; // 限制垂直最大视角

        this.baseCreate();
    }

    start (): void {
        this.isStart = true;
        this.itemCreate();
    }

    restart (): void {
        this.isFailed = false;
        this.defaultHp = 3;
        this.curHp = 3;
        this.score = 0;

        this.curItemMovement?.stop();
        this.curItemMovement = null;
        this.isItemMoving = false;
        this.itemCollideList = {};
        this.itemKillingProgress = {};

        for (const { mesh, body } of this.itemList) {
            this.kill(mesh, body);
        }
        this.itemList = [];
        this.kill(this.curItem?.mesh!, this.curItem?.body!);
        this.kill(this.baseTowerMesh!, this.baseTowerbody!);
        this.baseCreate();

        this.itemCreate();
    }

    addNext (): void {
        this.itemCreate();
    }

    makeBody (
        { sx, sy, sz, rt, rb, h, sg }: Record<string, number>,
        { px, py, pz }: Record<string, number>,
        mass = 30,
        type: EShapeType = EShapeType.BOX
    ): CANNON.Body {
        let shape;
        if (type === EShapeType.BOX) {
            shape = new CANNON.Box(new CANNON.Vec3(sx, sy, sz));
        } else {
            shape = new CANNON.Cylinder(rt, rb, h, sg);
        }
        const body = new CANNON.Body({
            mass,
            shape
        });
        body.position.set(px, py, pz);
        return body;
    }

    sizeRandom (): number {
        // const rate = Math.random() * 3;
        // return rate > 0.25 ? rate : 0.25;
        // 随机控制大小 0.5 - 1.5 倍
        return Math.random() + 0.5;
    }

    baseCreate (): void {
        const { x, y, z } = this.baseTowerSize;
        const geometryMain = new THREE.BoxBufferGeometry(x, y, z);
        const materialMain = new THREE.MeshLambertMaterial(defaultMaterialArg);
        this.baseTowerMesh = new THREE.Mesh(geometryMain, materialMain);
        this.baseTowerMesh.position.set(0, y / 2, 0);
        this.baseTowerMesh.castShadow = true;
        this.baseTowerMesh.receiveShadow = true;
        this.scene!.add(this.baseTowerMesh);

        this.baseTowerbody = this.makeBody(
            { sx: x / 2, sy: y / 2, sz: z / 2 },
            { px: 0, py: y / 2, pz: 0 },
            100
        );
        this.baseTowerbody.sleep();
        this.world.addBody(this.baseTowerbody);
    }

    baseBodyConnect (): void {
        this.baseTowerMesh?.position.copy(this.baseTowerbody?.position as any);
        this.baseTowerMesh?.quaternion.copy(this.baseTowerbody?.quaternion as any);
    }

    boxCreate (): [TMeshMaterial, CANNON.Body] {
        let { x, y, z } = this.defaultInitItemBoxSize;
        const defaultMassRate = x * z;
        x *= this.sizeRandom();
        z *= this.sizeRandom();

        const geometry = new THREE.BoxBufferGeometry(x, y, z);
        const material = new THREE.MeshLambertMaterial(defaultMaterialArg);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, this.baseY + y * this.score + this.curInitDiffHeight, 0);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.scene!.add(mesh);

        const body = this.makeBody(
            { sx: x / 2, sy: y / 2, sz: z / 2 },
            { px: 0, py: this.baseY + y * this.score + this.curInitDiffHeight, pz: 0 },
            30 * (x * z / defaultMassRate)
        );

        return [mesh, body];
    }

    cylinderVolume (rt: number, rb: number, h: number): number {
        return 1 / 3 * Math.PI * h * (Math.pow(rt, 2) + Math.pow(rb, 2) + rt * rb);
    }

    cylinderCreate (): [TMeshMaterial, CANNON.Body] {
        let { rt, rb, h, sg } = this.defaultInitItemCylinderSize;
        // 假设每个物体密度各处相同，以体积换质量
        const defaultMassRate = this.cylinderVolume(rt, rb, h);
        rt *= this.sizeRandom();
        rb *= this.sizeRandom();

        const geometry = new THREE.CylinderBufferGeometry(rt, rb, h, sg, sg);
        const material = new THREE.MeshLambertMaterial(defaultMaterialArg);

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, this.baseY + h * this.score + this.curInitDiffHeight, 0);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.scene!.add(mesh);

        const body = this.makeBody(
            { rt, rb, h, sg: 8 },
            { px: 0, py: this.baseY + h * this.score + this.curInitDiffHeight, pz: 0 },
            30 * this.cylinderVolume(rt, rb, h) / defaultMassRate,
            EShapeType.CYLINDER
        );

        return [mesh, body];
    }

    itemCreate (): void {
        if (this.isItemMoving) {
            return;
        }

        let mesh, body;
        this.curItemNum += 1;
        this.moveAxle = this.moveAxle === EMoveAxleType.X ? EMoveAxleType.Z : EMoveAxleType.X;

        // 圆柱体在物理系统下性能消耗较大，出现概率调低
        if (Math.random() > 0.95) {
            [mesh, body] = this.cylinderCreate();
        } else {
            [mesh, body] = this.boxCreate();
        }

        // 开启碰撞校验
        this.itemCollideList[body.id] = true;
        this.itemCollide(mesh, body);

        // 记录物体，并移动网格模型
        this.curItem = { mesh, body };
        this.itemMovement(mesh, body);
    }

    itemMovement (mesh: TMeshMaterial, body: CANNON.Body): void {
        let target;
        const distance = this.moveWay === EMoveWayType.POSITIVE ? this.maxMoveDistance : -this.maxMoveDistance;
        const { x, y, z } = mesh.position;
        this.isItemMoving = true;

        // 来回切换移动方向
        if (this.moveAxle === EMoveAxleType.X) {
            target = { x: distance, y, z };
        } else {
            target = { x, y, z: distance };
        }

        // 得分越高速度越快
        const t = 600 - 15 * this.score;
        const time = t > 200 ? t : 200;

        const itemMeshMoveTween = new TWEEN.Tween(mesh.position)
            .to(target, time)
            .onComplete(() => {
                this.moveWay = this.moveWay === EMoveWayType.POSITIVE ? EMoveWayType.NEGATIVE : EMoveWayType.POSITIVE;
                this.itemMovement(mesh, body);
            });

        // 抛出，用于暂停等操作
        this.curItemMovement = itemMeshMoveTween;

        itemMeshMoveTween.start();
    }

    itemDropDown (): void {
        if (!this.isItemMoving) {
            return;
        }

        // 在这里才加入body是未了避免物体下落速度过高以及没必要的计算
        const { mesh } = this.curItem!;
        const { x, y, z } = mesh.position;
        this.curItem?.body.position.set(x, y, z);
        this.world.addBody(this.curItem?.body!);

        this.isItemMoving = false;
        // 停止物体运动并使之掉落
        this.curItemMovement?.stop();
        // 推入list，在animate中加入当前item的维度
        this.itemList.push(this.curItem!);
    }

    itemCollide (mesh: TMeshMaterial, body: CANNON.Body): void {
        body.addEventListener('collide', (evt: any) => {
            // 判断得分
            if (evt.target.position.y > this.baseTowerSize.y) {
                this.itemCollideList[body.id] = true;
            } else {
                this.itemCollideList[body.id] = false;
            }
            this.handleScoreCount();

            // 撞到地板销毁积木，节省性能开支
            if (evt.body.id === 0) {
                if (this.itemKillingProgress[body.id]) {
                    clearTimeout(this.itemKillingProgress[body.id]);
                    this.itemKillingProgress[body.id] = null;
                }
                this.itemKillingProgress[body.id] = setTimeout(() => {
                    this.killFallItem(mesh, body);
                }, 2000);
            }
        });
    }

    itemBodysConnect (): void {
        for (const item of this.itemList) {
            item.mesh.position.copy(item.body.position as any);
            item.mesh.quaternion.copy(item.body.quaternion as any);
        }
    }

    kill (mesh: TMeshMaterial, body: CANNON.Body): void {
        mesh.geometry.dispose();
        mesh.material.dispose();
        this.scene!.remove(mesh);
        this.world.removeBody(body);
    }

    killFallItem (mesh: TMeshMaterial, body: CANNON.Body): void {
        // 先把碰撞体积干掉，避免与地面发生碰撞导致抽搐
        this.world.removeBody(body);

        const { x, z } = mesh.position;
        const killingTweenbody = new TWEEN.Tween(body.position).to({ x, y: -20, z }, 1000);
        const killingTween = new TWEEN.Tween(mesh.position)
            .to({ x, y: -20, z }, 1000)
            .onComplete(() => this.kill(mesh, body));

        killingTweenbody.start();
        killingTween.start();
    }

    handleScoreCount (): void {
        let passCount = 0;
        const list = Object.values(this.itemCollideList);
        for (const v of list) {
            if (v) {
                passCount += 1;
            }
        }
        this.score = passCount;
        this.curHp = this.defaultHp - (list.length - passCount);

        if (this.curHp <= 0) {
            this.isFailed = true;
        }
    }

    animate (): void {
        requestAnimationFrame(this.animate.bind(this));

        TWEEN.update();
        this.world.fixedStep();

        this.groundBodyConnect();
        this.baseBodyConnect();
        this.itemBodysConnect();

        for (const { mesh } of this.itemList) {
            if ((mesh.material as THREE.ShaderMaterial).uniforms) {
                (mesh.material as THREE.ShaderMaterial).uniforms.u_time.value += this.clock?.getDelta();
            }
        }

        this.renderer?.render(
            this.scene as THREE.Object3D<THREE.Event>,
            this.camera as THREE.Camera
        );
    }
}
