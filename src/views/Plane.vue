<template>
	<div class="total">
		<!-- <div id="container"></div> -->
        <!-- <canvas id="glslCanvas" data-fragment="
            #ifdef GL_ES
            precision mediump float;
            #endif

            uniform vec2 u_resolution;
            uniform float u_time;

            void main()
            {
                vec2 uv = gl_FragColor.xy / u_resolution.xy;

                vec3 col = 0.5 + 0.5 * cos(u_time + uv.xyx + vec3(0,2,4));

                gl_FragColor = vec4(1.,1.,1.,1.0);
            }
        " width="500" height="500"></canvas> -->
        <div class="p5sketch">
            <!-- <div class="detail">详情</div> -->
        </div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@vue/composition-api';
import Plane from '../model/plane';
import { funnelAnalyzeP5 } from '../model/p5';

export default defineComponent({
    name: 'plane',
	components: {},
    setup () {
        const plane = ref<Plane | null>(null);
        const funnelAnalyze = ref<funnelAnalyzeP5 | null>(null);

        const init = (): void => {
			plane.value = new Plane(
				document.querySelector('#container') as HTMLElement
			);
            plane.value.init();
			plane.value.animate();
		};

        onMounted(() => {
			// init();
            // var canvas = document.createElement('canvas');
            // var sandbox = new GlslCanvas(canvas);
            // sandbox.load(shader.value);

            // eslint-disable-next-line new-cap
            funnelAnalyze.value = new funnelAnalyzeP5(document.querySelector('.p5sketch') as HTMLElement);
        });
    }
});
</script>

<style lang="less">
.total {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

#container {
	width: 100vw;
	height: 100vw;
    max-width: 500px;
    max-height: 500px;
	background: black;
}

#glslCanvas {
    background-color: rgba(1, 1, 1, 0);
    width: 100%;
    height: 100%;
}

.p5sketch {
    position: relative;
    // width: 400px;
    // height: 600px;
}

.detail {
    background: white;
    z-index: 1000;
    position: absolute;
    top: 50%;
    left: 50%;
    cursor: pointer;
    &:hover {
        color: aqua;
    }
}
</style>
