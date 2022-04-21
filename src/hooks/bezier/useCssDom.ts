import { computed } from '@vue/composition-api';
import { useKeyPoints } from './useKeyPoints';

interface ICssDomHook {
    pointsStyle: any;
}

export const useCssDom = (keyPoints: Record<string, number[]>): ICssDomHook => {
    const {
        currentPoint,
        nBezier
    } = useKeyPoints(keyPoints);

    const pointsStyle = computed(() => {
        return (t: number): Record<string, string> => {
            const { p1, p2, cp1 } = keyPoints;
            const p = nBezier.twoBezier(t, p1, p2, cp1);
            const color = currentPoint.value[0] > p[0] ? 'orange' : 'white';
            return {
                left: `${p[0]}px`,
                bottom: `${70 - p[1]}px`,
                background: color,
                'box-shadow': `0 0 3px ${color}`
            };
        };
    });

    return {
        pointsStyle
    };
};
