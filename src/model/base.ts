import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { throttle } from 'lodash';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Vector2 } from 'three';

export enum sceneType {
    PHYSI = 'physi',
    NORMAL = 'normal',
}

export enum cameraType {
    PerspectiveCamera = 'PerspectiveCamera',
    OrthographicCamera = 'OrthographicCamera'
}

type TPos = Record<string, number> | THREE.Vector3;
export type TIntersects = THREE.Intersection < THREE.Object3D < THREE.Event >> [];

const getNormalizedMousePos = (e: MouseEvent | Touch) => {
    return {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
    };
};

export default class Total {
    container: HTMLElement | null = null;
    aspectRatio = 0;
    zoom = 1;
    mousePos: THREE.Vector2 = new Vector2(0, 0);
    mouseSpeed = 0;
    raycaster = new THREE.Raycaster();

    // 通常参数
    controls: any = null;
    camera: THREE.PerspectiveCamera | THREE.Camera | null = null;
    scene: THREE.Scene | null = null;
    renderer: THREE.WebGLRenderer | null = null;
    light: THREE.DirectionalLight | THREE.PointLight | null = null;
    clock: THREE.Clock | null = null;
    currentTime = 0;

    // 物理世界参数
    protected world: CANNON.World = new CANNON.World({
        gravity: new CANNON.Vec3(0, -98.2, 0) // 设置重力，地球重力9.82，假设为十个地球重力
    });

    groundBody: CANNON.Body | null = null;
    groundMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshLambertMaterial> | null = null;

    constructor (contain: HTMLElement) {
        this.container = contain;
        this.aspectRatio = contain.clientWidth / contain.clientHeight;
    }

    sceneInit (type: sceneType): void {
        this.scene = new THREE.Scene();
        this.trackMousePos();

        if (type === sceneType.PHYSI) {
            const geometryPlane = new THREE.PlaneBufferGeometry(1000, 1000);
            const materialPlane = new THREE.MeshLambertMaterial({
                color: 'white',
                emissive: 'rgb(80, 80, 80)'
            });

            this.groundMesh = new THREE.Mesh(geometryPlane, materialPlane);
            this.groundMesh.position.set(0, 0, 0);
            this.groundMesh.receiveShadow = true;
            this.scene!.add(this.groundMesh);

            this.groundBody = new CANNON.Body({
                type: CANNON.Body.STATIC,
                shape: new CANNON.Plane()
            });

            this.world.addBody(this.groundBody);

            this.groundBody.position.set(0, 0, 0);
            this.groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        }
    }

    lightInit ({ x, y, z }: TPos): void {
        const light = new THREE.PointLight(new THREE.Color('#ffffff'), 1, 1000);
        light.position.set(x, y, z);
        this.scene!.add(light);

        const ambientLight = new THREE.AmbientLight(new THREE.Color('#ffffff'), 0.5);
        this.scene!.add(ambientLight);
        this.light = light;

        this.light.castShadow = true;
        this.light.shadow.mapSize.width = 2048;
        this.light.shadow.mapSize.height = 2048;
    }

    cameraInit (
        zoom: number,
        type: cameraType,
        { x: px, y: py, z: pz }: TPos,
        { x: lx, y: ly, z: lz }: TPos
    ): void {
        if (type === cameraType.PerspectiveCamera) {
            this.camera = new THREE.PerspectiveCamera(
                45,
                this.aspectRatio,
                1,
                10000
            );
        } else {
            const { aspectRatio } = this;
            this.camera = new THREE.OrthographicCamera(
                -zoom * aspectRatio,
                zoom * aspectRatio,
                zoom,
                -zoom,
                0,
                1000
            );
        }

        this.camera.position.set(px, py, pz);
        this.camera.lookAt(lx, ly, lz);
    }

    rendererInit (): void {
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(
            this.container!.clientWidth,
            this.container!.clientHeight
        );

        this.renderer.setClearColor(0x000000, 0);
        this.renderer.shadowMap.enabled = true;
        this.container?.appendChild(this.renderer.domElement);
    }

    controlsInit (): void {
        this.controls = new OrbitControls(this.camera!, this.renderer?.domElement);
    }

    clockInit (): void {
        this.clock = new THREE.Clock();
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    ani (cb: () => void, obj: any): any {
        this.currentTime = this.clock?.getDelta() as number;

        cb.call(obj);

        this.renderer?.render(
            this.scene as THREE.Object3D<THREE.Event>,
            this.camera as THREE.Camera
        );
        requestAnimationFrame(this.ani.bind(this, cb, obj));
    }

    groundBodyConnect (): void {
        this.groundMesh!.position.copy(this.groundBody!.position as any);
        this.groundMesh!.quaternion.copy(this.groundBody!.quaternion as any);
    }

    clear (): void {
        this.scene?.clear();
        this.scene?.remove();
    }

    axisHelper (): void {
        const helper = new THREE.AxesHelper(30);
        helper.position.y = 0;
        this.scene?.add(helper);
    }

    gridHelper (): void {
        const gridHelper = new THREE.GridHelper(100, 30, 0x2C2C2C, 0x888888);
        gridHelper.position.y = 0;
        this.scene!.add(gridHelper);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    trackRaycaster (cb: (intersects: TIntersects) => any, obj: any): void {
        window.addEventListener('mousedown', () => {
            this.raycaster.setFromCamera(this.mousePos, this.camera!);
            const intersects = this.raycaster.intersectObjects(this.scene?.children!, true);
            if (intersects.length > 0) {
                cb.call(obj, intersects);
            }
        });
    }

    trackMousePos (): void {
        window.addEventListener('mousemove', throttle(
            (e) => {
                this.setMousePos(e);
            }, 1000 / 60
        ));
        window.addEventListener(
            'touchstart',
            throttle(
                (e: TouchEvent) => {
                    this.setMousePos(e.touches[0]);
                }, 1000 / 60
            ),
            { passive: false }
        );
        window.addEventListener('touchmove', throttle(
                (e: TouchEvent) => {
                    this.setMousePos(e.touches[0]);
                }, 1000 / 60
            )
        );
    }

    trackMouseSpeed (): void {
        // https://stackoverflow.com/questions/6417036/track-mouse-speed-with-js
        let lastMouseX = -1;
        let lastMouseY = -1;
        let mouseSpeed = 0;
        window.addEventListener('mousemove', (e) => {
            const mousex = e.pageX;
            const mousey = e.pageY;
            if (lastMouseX > -1) {
                mouseSpeed = Math.max(
                Math.abs(mousex - lastMouseX),
                Math.abs(mousey - lastMouseY)
                );
                this.mouseSpeed = mouseSpeed / 100;
            }
            lastMouseX = mousex;
            lastMouseY = mousey;
        });
        document.addEventListener('mouseleave', () => {
            this.mouseSpeed = 0;
        });
      }

    // 设置鼠标位置
    setMousePos (e: MouseEvent | Touch): void {
        const { x, y } = getNormalizedMousePos(e);
        this.mousePos.x = x;
        this.mousePos.y = y;
    }
}
