import * as THREE from 'three';

import Base, { sceneType, cameraType } from './base';

import { Bezier } from '../maths/bezier';

type TMesh = THREE.Mesh<THREE.TubeGeometry, THREE.MeshBasicMaterial>
type TKeyPoints = Record<string, any>;

const nBezier = new Bezier();

class CustomSinCurve extends THREE.Curve<THREE.Vector3> {
    scale = 1;
    keyPoints: TKeyPoints = {};

    constructor (scale: number, keyPoints: TKeyPoints) {
        super();
        this.scale = scale;
        this.keyPoints = keyPoints;
    }

    getPoint (t: number, optionalTarget = new THREE.Vector3()) {
        const { p1, p2, cp1 } = this.keyPoints;
        const point = nBezier.twoBezier(t, p1, p2, cp1);
        const tx = point[0] / 10;
        const ty = (70 - point[1]) / 10;
        const tz = 0;

        return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
    }
}

export default class BezierThreePlane extends Base {
    defaultCameraLookAt: THREE.Vector3 = new THREE.Vector3(55, 17.5, 0);
    defaultCameraPos: THREE.Vector3 = new THREE.Vector3(55, 17.5, 42);

    p = 0;
    keyPoints: TKeyPoints = {};
    currentPoint: number[] = [0, 0];
    currentCP: number[] = [0, 0];

    currentMesh: TMesh | null = null;

    init (keyPoints: TKeyPoints): void {
        this.keyPoints = keyPoints;

        this.sceneInit(sceneType.NORMAL);
        this.cameraInit(
            cameraType.PerspectiveCamera,
            this.defaultCameraPos,
            this.defaultCameraLookAt
        );
        this.rendererInit();

        this.curveLineCreate(this.keyPoints, 'white', 1.2);
    }

    killMesh (): void {
        this.currentMesh!.geometry.dispose();
        this.currentMesh!.material.dispose();
        this.scene!.remove(this.currentMesh!);
    }

    curveLineCreate (
        points: TKeyPoints,
        color: string,
        rad: number
    ): TMesh {
        const path1 = new CustomSinCurve(5, points);
        const geometry = new THREE.TubeGeometry(path1, 200, rad, 8, false);
        const material = new THREE.MeshBasicMaterial({ color });
        const mesh = new THREE.Mesh(geometry, material);
        this.scene!.add(mesh);
        return mesh;
    }

    animate (): void {
        requestAnimationFrame(this.animate.bind(this));

        if (this.currentMesh) {
            this.killMesh();
        }
        this.currentMesh = this.curveLineCreate(
            {
                p1: this.keyPoints.p1,
                p2: this.currentPoint,
                cp1: this.currentCP
            },
            'orange',
            1.25
        );

        this.renderer?.render(
            this.scene as THREE.Object3D<THREE.Event>,
            this.camera as THREE.Camera
        );
    }
}
