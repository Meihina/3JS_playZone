import * as THREE from 'three';

import Base, { sceneType, cameraType } from './base';

import vertex from '../shader/heaven/vertex.glsl';
import fragment from '../shader/heaven/fragment.glsl';

type TCube
    = THREE.Points<THREE.SphereGeometry | THREE.BoxBufferGeometry | THREE.BufferGeometry, THREE.ShaderMaterial>
    | THREE.Mesh<THREE.SphereGeometry | THREE.BoxBufferGeometry | THREE.BufferGeometry, THREE.ShaderMaterial>

export default class Cube extends Base {
    defaultCameraLookAt: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    defaultCameraPos: THREE.Vector3 = new THREE.Vector3(25, 25, 25);

    ball: TCube | null = null;

    init (): void {
        this.sceneInit(sceneType.NORMAL);
        this.cameraInit(
            1,
            cameraType.PerspectiveCamera,
            this.defaultCameraPos,
            this.defaultCameraLookAt
        );
        this.rendererInit();
        this.controlsInit();
        this.clockInit();

        this.ball = this.ballCreate();

        this.ani(this.animate, this);
    }

    ballCreate (): TCube {
        const geometry = new THREE.SphereGeometry(10, 128, 128);
        const material = new THREE.ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment,
            uniforms: {
                uBaseColor: {
                    value: new THREE.Vector3(0.809, 1.0, 0.981)
                },
                uTime: {
                    value: 0
                }
            }
        });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.castShadow = true;
        sphere.receiveShadow = true;
        this.scene!.add(sphere);

        return sphere;
    }

    animate (): void {
        (this.ball!.material as THREE.ShaderMaterial).uniforms.uTime.value += this.currentTime;
    }
}
