import { computed, ComputedRef } from '@vue/composition-api';
import { useKeyPoints } from './useKeyPoints';

interface ISVGHook {
    svgParams: ComputedRef<string>;
    curSvgParams: ComputedRef<string>;
}

export const useSVG = (keyPoints: Record<string, number[]>): ISVGHook => {
    const {
        currentPoint,
        currentCP
    } = useKeyPoints(keyPoints);

    const svgParams = computed<string>(() => {
        const { p1, p2, cp1 } = keyPoints;
        return `M${p1.join(',')} Q${cp1.join(',')} ${p2.join(',')}`;
    });

    const curSvgParams = computed<string>(() => {
        const { p1 } = keyPoints;
        return `M${p1.join(',')} Q${currentCP.value.join(',')} ${currentPoint.value.join(',')}`;
    });

    return {
        svgParams,
        curSvgParams
    };
};
