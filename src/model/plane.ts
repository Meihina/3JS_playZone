import * as THREE from 'three';

import Base, { sceneType, cameraType } from './base';

import { usualVertexShader } from '../shader/utils';
import { planeFractShader, snowShader, colorZKShader } from '../shader/planeShader';

type TMeshMaterial =
    THREE.Mesh<
        THREE.BoxGeometry | THREE.CylinderGeometry | THREE.PlaneGeometry,
        THREE.MeshNormalMaterial | THREE.MeshLambertMaterial | THREE.ShaderMaterial | THREE.MeshBasicMaterial
    >

export default class Plane extends Base {
    clock: THREE.Clock | null = null;
    plane: TMeshMaterial | null = null;

    init (): void {
        this.sceneInit(sceneType.NORMAL);

        const axes = new THREE.AxesHelper(30);
        this.scene!.add(axes);
        const gridHelper = new THREE.GridHelper(100, 30, 0x2C2C2C, 0x888888);
        gridHelper.position.y = -10;
        this.scene!.add(gridHelper);

        this.cameraInit(
            cameraType.PerspectiveCamera,
            { px: 0, py: 0, pz: 50 },
            { lx: 0, ly: 0, lz: 0 }
        );
        // this.camera?.scale.set(2, 2, 2);

        this.rendererInit();
        this.controlsInit();
        this.planeInit();

        this.clock = new THREE.Clock();
    }

    planeInit (): void {
        // const geometry = new THREE.PlaneGeometry(this.container?.clientWidth, this.container?.clientHeight);
        const geometry = new THREE.BoxBufferGeometry(2, 2, 2);
        const material = new THREE.ShaderMaterial(
            {
                vertexShader: usualVertexShader,
                fragmentShader: colorZKShader,
                uniforms: {
                    uTime: {
                        value: 0
                    },
                    uResolution: {
                        value: new THREE.Vector2(
                            this.container?.clientWidth,
                            this.container?.clientHeight
                        )
                    }
                }
            }
        );
        // const material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
        this.plane = new THREE.Mesh(geometry, material);
        this.scene!.add(this.plane);
    }

    animate (): void {
        requestAnimationFrame(this.animate.bind(this));

        (this.plane!.material as THREE.ShaderMaterial).uniforms.uTime.value += this.clock!.getDelta();

        this.renderer?.render(
            this.scene as THREE.Object3D<THREE.Event>,
            this.camera as THREE.Camera
        );
    }
}
