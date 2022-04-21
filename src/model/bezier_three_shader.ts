import * as THREE from 'three';

import Base, { sceneType, cameraType } from './base';

import vertex from '../shader/bezier/vertex.glsl';
import fragment from '../shader/bezier/fragment.glsl';

type TMesh = THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>
type TKeyPoints = Record<string, any>;

export default class BezierThreeShader extends Base {
    defaultCameraLookAt: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    defaultCameraPos: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

    keyPoints: TKeyPoints = {};
    currentPoint: number[] = [0, 0];
    currentCP: number[] = [0, 0];
    plane: TMesh | null = null;

    init (keyPoints: TKeyPoints): void {
        this.keyPoints = keyPoints;

        this.sceneInit(sceneType.NORMAL);
        this.cameraInit(
            1,
            cameraType.OrthographicCamera,
            this.defaultCameraPos,
            this.defaultCameraLookAt
        );
        this.rendererInit();
        this.controlsInit();

        this.plane = this.planeCreate();

        this.ani(this.animate, this);
    }

    planeCreate (): TMesh {
        const r = 22 / 7; // 宽高比
        const geometry = new THREE.PlaneGeometry(2 * r, 2);
        const material = new THREE.ShaderMaterial(
            {
                vertexShader: vertex,
                fragmentShader: fragment,
                uniforms: {
                    uTime: {
                        value: 0
                    },
                    uCurrentPoint: {
                        value: new THREE.Vector2(0, 0)
                    }
                }
            }
        );
        const plane = new THREE.Mesh(geometry, material);
        this.scene!.add(plane);
        return plane;
    }

    animate (): void {
        (this.plane!.material as THREE.ShaderMaterial).uniforms.uCurrentPoint.value = new THREE.Vector2(this.currentPoint[0], this.currentPoint[1]);
    }
}
