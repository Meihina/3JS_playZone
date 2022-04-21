import { onMounted, ref, Ref } from '@vue/composition-api';
import { useKeyPoints } from './useKeyPoints';
import P5 from 'p5';

interface IP5CanvasHook {
    sketch: Ref<P5 | undefined>;
}

export const useP5Canvas = (keyPoints: Record<string, number[]>): IP5CanvasHook => {
    const {
        currentPoint,
        currentCP
    } = useKeyPoints(keyPoints);

    const sketch = ref<P5>();
    const p5Sketch = (p: P5): void => {
        const { p1, p2, cp1 } = keyPoints;

        function totalLine () {
            p.noFill();
            p.stroke(255, 255, 255);
            p.strokeWeight(5);
            p.beginShape();
            p.vertex(p1[0], p1[1]);
            p.quadraticVertex(cp1[0], cp1[1], p2[0], p2[1]);
            p.endShape();
        }

        function currentLine () {
            p.noFill();
            p.stroke('orange');
            p.strokeWeight(5);
            p.beginShape();
            p.vertex(p1[0], p1[1]);
            p.quadraticVertex(currentCP.value[0], currentCP.value[1], currentPoint.value[0], currentPoint.value[1]);
            p.endShape();
        }

        function currentArc () {
            const curp = currentPoint.value;
            p.stroke(245, 245, 245);
            p.arc(curp[0], curp[1], 7, 7, 0, 2 * p.PI);
            p.stroke('orange');
            p.arc(curp[0], curp[1], 3, 3, 0, 2 * p.PI);
        }

        p.setup = function () {
            p.createCanvas(220, 70);
        };

        p.draw = function () {
            p.clear(255, 255, 255, 0);
            p.smooth();
            totalLine();
            currentLine();
            currentArc();

            p.loop();
        };
    };

    const p5Init = (): void => {
        const dom = document.querySelector('.p5sketch') as HTMLElement;
        sketch.value = new P5(p5Sketch, dom);
    };

    onMounted(() => {
        p5Init();
    });

    return {
        sketch
    };
};
