import * as THREE from 'three';

import Base, { sceneType, cameraType } from './base';

import { Bezier } from '../maths/bezier';

type TMesh = THREE.Mesh<THREE.TubeGeometry, THREE.MeshBasicMaterial>
type TKeyPoints = Record<string, any>;

const nBezier = new Bezier();

export default class BezierThreeShader extends Base {
    defaultCameraLookAt: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    defaultCameraPos: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

    p = 0;
    keyPoints: TKeyPoints = {};
    currentPoint: number[] = [0, 0];
    currentCP: number[] = [0, 0];
    currentMesh: TMesh | null = null;

    init (keyPoints: TKeyPoints): void {
        this.keyPoints = keyPoints;

        this.sceneInit(sceneType.NORMAL);

        this.axisHelper();
        this.gridHelper();

        this.cameraInit(
            cameraType.OrthographicCamera,
            this.defaultCameraPos,
            this.defaultCameraLookAt
        );

        this.rendererInit();
        this.controlsInit();
        this.planeCreate();
    }

    planeCreate (): void {
        const geometry = new THREE.PlaneGeometry(220 / 10 / this.zoom, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
        const plane = new THREE.Mesh(geometry, material);
        this.scene!.add(plane);
    }

    animate (): void {
        requestAnimationFrame(this.animate.bind(this));

        // if (this.currentMesh) {
        //     this.killMesh();
        // }
        // this.currentMesh = this.curveLineCreate(
        //     {
        //         p1: this.keyPoints.p1,
        //         p2: this.currentPoint,
        //         cp1: this.currentCP
        //     },
        //     'orange',
        //     1.25
        // );

        this.renderer?.render(
            this.scene as THREE.Object3D<THREE.Event>,
            this.camera as THREE.Camera
        );
    }
}
