import * as THREE from 'three';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry';

import Base, { sceneType, cameraType, TIntersects } from './base';

import vertex from '../shader/cube/vertex.glsl';
import fragment from '../shader/cube/fragment.glsl';

// u 和 v 会对应递增到 1
const sphube = (_u: number, _v: number, target: any) => {
    const s = 0.5;
    const r = 0.25;

    const theta = 2 * Math.PI * _u;
    const phi = _v * 2 * Math.PI;

    const u = Math.cos(theta) * Math.cos(phi);
    const v = Math.cos(theta) * Math.sin(-phi);
    const w = Math.sin(theta);

    const x = (r * u) / Math.sqrt(1 - s * v ** 2 - s * w ** 2);
    const y = (r * v) / Math.sqrt(1 - s * u ** 2 - s * w ** 2);
    const z = (r * w) / Math.sqrt(1 - s * Math.cos(theta) ** 2);

    target.set(x, y, z);
};

const displacementMapUrl1 = 'https://ali.static.yximgs.com/udata/pkg/doodle_static/upload/6238f14d9b26260dafe5073f41c52ab0.jpg';
const displacementMapUrl2 = 'https://ali.static.yximgs.com/udata/pkg/doodle_static/upload/9ae32885307fe72eebba6d9f017bdd17.png';
const displacementMapUrl3 = 'https://ali.static.yximgs.com/udata/pkg/doodle_static/upload/e4eb36e69a7779fe6eba3841756e4bf3.jpg';

const diff = 0.28;
const { Vector3 } = THREE;
const blockInitPositions = [
    new Vector3(diff, diff, diff),
    new Vector3(diff, diff, -diff),
    new Vector3(diff, -diff, diff),
    new Vector3(-diff, diff, diff),
    new Vector3(-diff, -diff, diff),
    new Vector3(-diff, diff, -diff),
    new Vector3(diff, -diff, -diff),
    new Vector3(-diff, -diff, -diff)
];

type TCube
    = THREE.Points<THREE.SphereGeometry | THREE.BoxBufferGeometry | THREE.BufferGeometry, THREE.ShaderMaterial>
    | THREE.Mesh<THREE.SphereGeometry | THREE.BoxBufferGeometry | THREE.BufferGeometry, THREE.ShaderMaterial>

export default class Cube extends Base {
    defaultCameraLookAt: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    defaultCameraPos: THREE.Vector3 = new THREE.Vector3(5, 5, 5);

    meshs: TCube[] = [];

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
        this.trackMouseSpeed();
        this.trackRaycaster(this.rayCasterWork, this);

        this.rubiksInit();

        this.ani(this.animate, this);
    }

    boxCreate (initTime: number): TCube {
        const loader = new THREE.TextureLoader();
        const displacementMap1 = loader.load(displacementMapUrl1);
        const displacementMap2 = loader.load(displacementMapUrl2);
        const displacementMap3 = loader.load(displacementMapUrl3);

        const geometry = new ParametricGeometry(sphube, 1000, 50);
        const material = new THREE.ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment,
            uniforms: {
                uBaseColor: {
                    value: new THREE.Vector3(0.579, 0.388, 1.0)
                },
                uTime: {
                    value: initTime
                },
                uMouse: {
                    value: this.mousePos
                },
                uMouseSpeed: {
                    value: this.mouseSpeed
                },
                uResolution: {
                    value: new THREE.Vector2(window.innerWidth, window.innerHeight)
                },
                uLightPos: {
                    value: new THREE.Vector3(3, 3, 3)
                },
                uDisplacementMap1: {
                    value: displacementMap1
                },
                uDisplacementMap2: {
                    value: displacementMap2
                },
                uDisplacementMap3: {
                    value: displacementMap3
                }
            }
        });
        return new THREE.Mesh(geometry, material);
    }

    rubiksInit (): void {
        blockInitPositions.map((pos: THREE.Vector3, idx) => {
            const mesh = this.boxCreate(idx * 0.1);
            const { x, y, z } = pos;
            mesh.position.set(x, y, z);
            this.meshs.push(mesh);
            this.scene?.add(mesh);
        });
    }

    rayCasterWork (intersects: TIntersects): void {
        // 选中第一个射线相交的物体
        ((intersects[0].object as TCube).material as THREE.ShaderMaterial).uniforms.uBaseColor.value = new THREE.Vector3(0.579, 0.388, 0.5);
    }

    animate (): void {
        this.meshs.map((mesh) => {
            (mesh.material as THREE.ShaderMaterial).uniforms.uTime.value += this.currentTime;
            (mesh.material as THREE.ShaderMaterial).uniforms.uMouse.value = this.mousePos;
            (mesh.material as THREE.ShaderMaterial).uniforms.uMouseSpeed.value = this.mouseSpeed;
        });
    }
}
