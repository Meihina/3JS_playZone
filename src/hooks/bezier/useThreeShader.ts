import { onMounted, ref, Ref } from '@vue/composition-api';
import { useKeyPoints } from './useKeyPoints';
import BezierShader from '../../model/bezier_three_shader';

interface IThreeShaderHook {
    threePlaneShader: Ref<any>;
}

export const useThreeShader = (keyPoints: Record<string, number[]>): IThreeShaderHook => {
    const {
        currentPoint,
        currentCP
    } = useKeyPoints(keyPoints);

    const threePlaneShader = ref<BezierShader | null>(null);
    const handleThreeBezierShaderInit = () => {
        threePlaneShader.value = new BezierShader(
            document.querySelector('#three-container-shader') as HTMLElement
        );
        threePlaneShader.value.init(keyPoints);
    };

    onMounted(() => {
        function ani () {
            if (threePlaneShader.value) {
                threePlaneShader.value.currentPoint = currentPoint.value;
                threePlaneShader.value.currentCP = currentCP.value;
            }
            requestAnimationFrame(ani);
        }
        ani();

        handleThreeBezierShaderInit();
    });

    return {
        threePlaneShader
    };
};
