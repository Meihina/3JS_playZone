import * as THREE from 'three';
import * as CANNON from 'cannon-es';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export enum sceneType {
    PHYSI = 'physi',
    NORMAL = 'normal',
}

export enum cameraType {
    PerspectiveCamera = 'PerspectiveCamera',
    OrthographicCamera = 'OrthographicCamera'
}

export default class Total {
    container: HTMLElement | null = null;
    aspectRatio = 0;
    zoom = 2;

    // 通常参数
    controls: any = null;
    camera: THREE.PerspectiveCamera | THREE.Camera | null = null;
    scene: THREE.Scene | null = null;
    renderer: THREE.WebGLRenderer | null = null;
    light: THREE.DirectionalLight | THREE.PointLight | null = null;

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

    lightInit ({ x, y, z }: Record<string, number>): void {
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
        type: cameraType,
        { px, py, pz }: Record<string, number>,
        { lx, ly, lz }: Record<string, number>
    ): void {
        if (type === cameraType.PerspectiveCamera) {
            this.camera = new THREE.PerspectiveCamera(
                45,
                this.aspectRatio,
                1,
                10000
            );
        } else {
            const { zoom, aspectRatio } = this;
            this.camera = new THREE.OrthographicCamera(
                -zoom * aspectRatio,
                zoom * aspectRatio,
                zoom,
                -zoom,
                0.01,
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
        this.controls = new OrbitControls(this.camera, this.renderer?.domElement);
        this.controls.maxPolarAngle = Math.PI / 2 - 0.01; // 限制垂直最大视角
    }

    groundBodyConnect (): void {
        this.groundMesh!.position.copy(this.groundBody!.position as any);
        this.groundMesh!.quaternion.copy(this.groundBody!.quaternion as any);
    }

    clear (): void {
        this.scene?.clear();
        this.scene?.remove();
    }
}
