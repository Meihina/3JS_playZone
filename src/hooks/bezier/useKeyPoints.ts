import { computed, ComputedRef, ref, Ref, onMounted } from '@vue/composition-api';
import { Bezier } from '../../maths/bezier';

interface IKeyPointsHook {
    p: Ref<number>;
    currentPoint: ComputedRef<number[]>;
    currentCP: ComputedRef<number[]>;
    nBezier: Bezier;
}

export const useKeyPoints = (keyPoints: Record<string, number[]>): IKeyPointsHook => {
    const p = ref<number>(0); // 百分比
    const nBezier: Bezier = new Bezier();

    const currentPoint = computed(() => {
        const { p1, p2, cp1 } = keyPoints;
        const point = nBezier.twoBezier(p.value, p1, p2, cp1);
        return point;
    });

    const currentCP = computed(() => {
        const { p1, p2, cp1 } = keyPoints;
        const curp = currentPoint.value;
        const cp = nBezier.twoBezier2CP(
            0.5,
            p1,
            curp,
            nBezier.twoBezier(p.value / 2, p1, p2, cp1)
        );
        return cp;
    });

    onMounted(() => {
        function start () {
            if (p.value >= 1) {
                p.value = 0;
            }
            p.value += 0.005;
            requestAnimationFrame(start);
        }
        start();
    });

    return {
        p,
        currentPoint,
        currentCP,
        nBezier
    };
};
