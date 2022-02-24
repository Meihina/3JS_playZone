import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

import Base, { sceneType, cameraType } from './base';

enum EScaleType {
    POSITIVE = 'positive',
    NEGATIVE = 'negative'
}

enum ECameraScaleType {
    CLOSE = 'close',
    FAR = 'far'
}

const closeRate =
    /Mobi|Android|iPhone/i.test(navigator.userAgent)
        ? { x: 1.4, y: 1.4, z: 1.4 }
        : { x: 1, y: 1, z: 1 };

const cameraScaleArgs = {
    [ECameraScaleType.CLOSE]: {
        rate: closeRate,
        time: 500
    },
    [ECameraScaleType.FAR]: {
        rate: { x: 3.5, y: 3.5, z: 3.5 },
        time: 3000
    }
};

type TMeshMaterial =
    THREE.MeshNormalMaterial
    | THREE.MeshLambertMaterial;

type TTweenAni = TWEEN.Tween<THREE.Vector3>;

export default class Doodle extends Base {
    isDroping = false;
    isDoodleCreated = false;
    isFailed = false;

    maxScale = 1;
    minScale = 0.05;
    lastScale = 1;
    scaleType: EScaleType = EScaleType.POSITIVE;
    curScaleVal = 0.5;

    sceneMesh: THREE.Mesh<THREE.BoxGeometry, TMeshMaterial> | null = null;
    doodleMesh: THREE.Mesh<THREE.BoxGeometry, TMeshMaterial> | null = null;
    doodleMeshList: THREE.Mesh<THREE.BoxGeometry, TMeshMaterial>[] = [];

    readonly defaultColor: number[] = [250, 250, 250];
    defaultCameraLookAt: THREE.Vector3 = new THREE.Vector3(0, 50.8, 0);
    defaultCameraPos: THREE.Vector3 = new THREE.Vector3(5, 55, 5);

    currentDoodleCount = 1;
    score = 0;

    endAni: TTweenAni | null = null;

    init (): void {
        this.sceneInit(sceneType.NORMAL);
        this.lightInit({ x: 50, y: 120, z: 150 });

        const { defaultCameraLookAt: l, defaultCameraPos: p } = this;
        this.cameraInit(
            cameraType.OrthographicCamera,
            { px: p.x, py: p.y, pz: p.z },
            { lx: l.x, ly: l.y, lz: l.z }
        );
        this.camera?.scale.set(2, 2, 2);

        this.rendererInit();

        // 网格模型添加到场景中
        const { lamberColorInit, defaultColor } = this;
        const geometryMain = new THREE.BoxBufferGeometry(2, 100, 2);
        const materialMain = new THREE.MeshLambertMaterial({
            color: lamberColorInit('color', defaultColor),
            emissive: lamberColorInit('emissive', defaultColor),
            emissiveIntensity: 2
        });
        this.sceneMesh = new THREE.Mesh(geometryMain, materialMain);
        this.sceneMesh.position.set(0, 0, 0);
        this.scene!.add(this.sceneMesh);
    }

    start (): void {
        this.cameraMoveCloseOrFar(ECameraScaleType.CLOSE);
    }

    fail (): void {
        this.isFailed = true;
        this.endAni = this.cameraMoveCloseOrFar(ECameraScaleType.FAR) as TTweenAni;
    }

    restart (): void {
        // 回归默认位置的渐变动画
        this.endAni!.stop();
        this.cameraMoveVertical(55);
        new TWEEN.Tween(this.camera?.scale!)
            .to(closeRate, 500)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();

        this.killMeshes();

        // 参数重置
        this.isDroping = false;
        this.isDoodleCreated = false;
        this.isFailed = false;

        this.lastScale = 1;
        this.scaleType = EScaleType.POSITIVE;
        this.curScaleVal = 0.5;

        this.doodleMesh = null;
        this.doodleMeshList = [];

        this.currentDoodleCount = 1;
        this.score = 0;
    }

    scaleArgsReset (): void {
        this.scaleType = EScaleType.POSITIVE;
        this.curScaleVal /= 2;
    }

    killMeshes (): void {
        for (const mesh of this.doodleMeshList) {
            mesh.geometry.dispose();
            mesh.material.dispose();
            this.scene!.remove(mesh);
        }
    }

    doodleCreate (): void {
        const { lamberColorInit, defaultColor, defaultCameraLookAt: l } = this;
        const geometry = new THREE.BoxBufferGeometry(2, 0.25, 2);
        const material = new THREE.MeshLambertMaterial({
            color: lamberColorInit('color', defaultColor.slice(), this.currentDoodleCount),
            emissive: lamberColorInit('emissive', defaultColor.slice(), this.currentDoodleCount),
            emissiveIntensity: 2
        });

        this.doodleMesh = new THREE.Mesh(geometry, material);
        this.doodleMesh.position.set(l.x, l.y + 1 + (this.currentDoodleCount - 1) * 0.25, l.z);

        // 初始化一个缩放大小，避免不和谐
        this.doodleMesh?.scale.set(this.curScaleVal, 1, this.curScaleVal);

        this.doodleMeshList.push(this.doodleMesh);

        this.scene!.add(this.doodleMesh);
        this.isDoodleCreated = true;
    }

    doodleScale (): void {
        if (!this.isFailed && !this.isDroping && this.isDoodleCreated) {
            if (this.scaleType === EScaleType.NEGATIVE) {
                this.curScaleVal -= 0.0075;
                if (this.curScaleVal <= this.minScale) {
                    this.scaleType = EScaleType.POSITIVE;
                }
            } else {
                this.curScaleVal += 0.0075;
                if (this.curScaleVal >= this.maxScale) {
                    this.scaleType = EScaleType.NEGATIVE;
                }
            }

            this.doodleMesh?.scale.set(this.curScaleVal, 1, this.curScaleVal);
        }
    }

    // 积木掉落
    doodleDrop (): void {
        if (!this.isDroping) {
            this.isDroping = true;

            this.cameraMoveVertical(this.camera?.position.y! + 0.25);

            // 积木大小近似处理
            let n = Math.floor(this.curScaleVal / 0.05 - this.curScaleVal % 0.05);
            const o = this.curScaleVal % 0.05;
            if (o >= 0.025) {
                n += 1;
            }

            this.curScaleVal = Number((n * 0.05).toFixed(2));

            const { defaultCameraLookAt: l } = this;
            const doodleDropTween = new TWEEN.Tween(this.doodleMesh?.position!)
                .to({
                    x: l.x,
                    y: l.y - 0.8 + (0.25 * this.currentDoodleCount) - 0.125,
                    z: l.z
                }, 500)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onComplete(() => {
                    this.isDroping = false;
                    this.currentDoodleCount += 1;
                    this.score += 1;

                    if (this.curScaleVal > this.lastScale) {
                        this.fail();
                    } else {
                        this.lastScale = this.curScaleVal;
                        this.scaleArgsReset();
                        this.doodleCreate();
                    }
                });

            const doodleScaleTween = new TWEEN.Tween(this.doodleMesh?.scale!)
                .to({
                    x: this.curScaleVal,
                    y: 1,
                    z: this.curScaleVal
                }, 200)
                .easing(TWEEN.Easing.Linear.None);

            doodleScaleTween.start();
            doodleDropTween.start();
        }
    }

    // 相机垂直运动
    cameraMoveVertical (moveY: number): void {
        const cameraTween = new TWEEN.Tween(this.camera?.position!)
            .to({ x: 5, y: moveY, z: 5 }, 500);

        cameraTween.start();
    }

    // 相机镜头远近拉伸
    cameraMoveCloseOrFar (type: ECameraScaleType): TTweenAni | undefined {
        if (
            type === ECameraScaleType.CLOSE &&
            this.camera?.scale.x === closeRate.x
        ) {
            this.doodleCreate();
            return;
        }

        const cameraTween = new TWEEN.Tween(this.camera?.scale!)
            .to(
                cameraScaleArgs[type].rate,
                cameraScaleArgs[type].time
            )
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete(() => {
                if (type === ECameraScaleType.CLOSE) {
                    this.doodleCreate();
                }
            });

        cameraTween.start();
        return cameraTween;
    }

    lamberColorInit (
        type: 'color' | 'emissive',
        color: number[],
        count?: number
    ): string {
        if (count) {
            let curColorIndex = 0;
            while (1) {
                if (count * 10 > color[curColorIndex] - 100) {
                    count -= (color[curColorIndex] - 100) / 10;
                    color[curColorIndex] = 100;
                    curColorIndex++;
                } else {
                    color[curColorIndex] -= count * 10;
                    break;
                }
            }
        }

        if (type === 'color') {
            return `rgb(${color.join(',')})`;
        } else {
            return `rgb(${[0, 0, 250].join(',')})`;
        }
    }

    animate (): void {
        requestAnimationFrame(this.animate.bind(this));

        this.doodleScale();
        TWEEN.update();

        this.renderer?.render(
            this.scene as THREE.Object3D<THREE.Event>,
            this.camera as THREE.Camera
        );
    }
}
