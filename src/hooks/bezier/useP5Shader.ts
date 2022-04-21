import { onMounted, ref, Ref } from '@vue/composition-api';
import { useKeyPoints } from './useKeyPoints';
import P5 from 'p5';

import fragment from '../../shader/bezier/fragment.glsl';
import vertex from '../../shader/bezier/vertex_p5.glsl';

interface IP5ShaderHook {
    sketch: Ref<any>;
}

export const useP5Shader = (keyPoints: Record<string, number[]>): IP5ShaderHook => {
    const {
        currentPoint
    } = useKeyPoints(keyPoints);

    const sketch = ref<P5>();
    const p5Sketch = (p: P5): void => {
        let shaderProgram: P5.Shader;

        p.setup = function () {
            p.createCanvas(220, 70, p.WEBGL);
            p.setAttributes('alpha', true); // 必须，允许渲染透明度

            shaderProgram = p.createShader(vertex, fragment);
            p.shader(shaderProgram);

            shaderProgram.setUniform('uCurrentPoint', [0, 0]);
        };

        p.draw = function () {
            p.background(255, 255, 255, 0.1);
            shaderProgram.setUniform('uCurrentPoint', currentPoint.value);
            p.quad(-1, -1, 1, -1, 1, 1, -1, 1);
        };
    };

    const p5Init = (): void => {
        const dom = document.querySelector('#p5-container-shader') as HTMLElement;
        sketch.value = new P5(p5Sketch, dom);
    };

    onMounted(() => {
        p5Init();
    });

    return {
        sketch
    };
};
