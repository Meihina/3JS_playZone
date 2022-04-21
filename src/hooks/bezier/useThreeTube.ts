import { onMounted, ref, Ref } from '@vue/composition-api';
import { useKeyPoints } from './useKeyPoints';
import BezierTube from '../../model/bezier_three_plane';

interface IThreeTubeHook {
    threeTubeBezier: Ref<any>;
}

export const useThreeTube = (keyPoints: Record<string, number[]>): IThreeTubeHook => {
    const {
        p,
        currentPoint,
        currentCP
    } = useKeyPoints(keyPoints);

    const threeTubeBezier = ref<BezierTube | null>(null);
    const handleThreeBezierTubeInit = () => {
        threeTubeBezier.value = new BezierTube(
            document.querySelector('#three-container-tube') as HTMLElement
        );
        threeTubeBezier.value.init(keyPoints);
        threeTubeBezier.value.animate();
    };

    onMounted(() => {
        function ani () {
            if (threeTubeBezier.value) {
                threeTubeBezier.value.p += p.value;
                threeTubeBezier.value.currentPoint = currentPoint.value;
                threeTubeBezier.value.currentCP = currentCP.value;
            }
            requestAnimationFrame(ani);
        }
        ani();

        handleThreeBezierTubeInit();
    });

    return {
        threeTubeBezier
    };
};
