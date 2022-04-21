import { onMounted } from '@vue/composition-api';
import { useKeyPoints } from './useKeyPoints';

interface ICanvasHook {
    canvasDraw: () => void;
}

export const useCanvas = (keyPoints: Record<string, number[]>): ICanvasHook => {
    const {
        currentPoint,
        currentCP
    } = useKeyPoints(keyPoints);

    const canvasDraw = (): void => {
        const canvas = document.getElementById('bezier-canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        const { p1, p2, cp1 } = keyPoints;

        canvas.height = canvas.offsetWidth;
        canvas.width = canvas.offsetHeight;

        ctx.lineWidth = 6;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(p1[0], p1[1]);
        ctx.quadraticCurveTo(cp1[0], cp1[1], p2[0], p2[1]);
        ctx.strokeStyle = 'white';
        ctx.stroke();

        const curp = currentPoint.value;
        const cp = currentCP.value;
        ctx.beginPath();
        ctx.moveTo(p1[0], p1[1]);
        ctx.quadraticCurveTo(cp[0], cp[1], curp[0], curp[1]);
        ctx.strokeStyle = 'orange';
        ctx.stroke();

        const p = currentPoint.value;
        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.arc(p[0], p[1], 6, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = 'orange';
        ctx.arc(p[0], p[1], 4, 0, 2 * Math.PI);
        ctx.fill();
    };

    onMounted(() => {
        function ani () {
            canvasDraw();
            requestAnimationFrame(ani);
        }
        ani();
    });

    return {
        canvasDraw
    };
};
