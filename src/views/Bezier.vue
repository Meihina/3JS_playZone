<template>
    <div class="contain">
        <div class="content">
            <!-- SVG -->
            <div class="svg">
                <svg id="svg" width="220" height="70">
                    <path :d="svgParams" stroke="#fff" fill="none" style="stroke-width: 6px; stroke-linecap: round;" />
                    <path :d="curSvgParams" stroke="orange" fill="none" style="stroke-width: 6px; stroke-linecap: round;" />
                    <circle
                        :cx="currentPoint[0]"
                        :cy="currentPoint[1]"
                        r="5"
                        stroke="red"
                        stroke-width="2px"
                        fill="orange"
                    />
                </svg>
            </div>

            <!-- canvas -->
            <div class="canvas">
                <canvas id="bezier-canvas" width="220" height="70"></canvas>
            </div>

            <!-- 主要作为canvas的上层库 —— p5.js -->
            <div class="p5">
                <div class="p5sketch"></div>
            </div>

            <!-- 纯css方案 -->
            <div class="scss">
                <div class="point" v-for="(ele, idx) in new Array(220)" :key="idx"></div>
            </div>
            <div class="less"></div>

            <!-- webgl -->
            <div class="webGL"></div>

            <!-- webgl上层库 -->
            <div class="three"></div>

            <!-- WTM直接叫GPU出来接客 -->
            <div class="shader-p5"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from '@vue/composition-api';
import { Bezier } from '../maths/bezier';
import P5 from 'p5';

export default defineComponent({
    setup () {
        const keyPoints = reactive({
            p1: [10, 60],
            p2: [210, 10],
            cp1: [160, 60]
        });
        const p = ref<number>(0); // 百分比
        const nBezier: Bezier = new Bezier();
        const sketch = ref<P5>();

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

        // ================== SVG方案主要代码 ==================
        const svgParams = computed(() => {
            const { p1, p2, cp1 } = keyPoints;
            return `M${p1.join(',')} Q${cp1.join(',')} ${p2.join(',')}`;
        });

        const curSvgParams = computed(() => {
            const { p1 } = keyPoints;
            return `M${p1.join(',')} Q${currentCP.value.join(',')} ${currentPoint.value.join(',')}`;
        });

        // ================== 纯Canvas方案主要代码 ==================
        const canvasDraw = () => {
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

        // ================== p5.js方案主要代码 ==================
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

        // ================== 纯webgl方案主要代码 ==================
        // ...

        onMounted(() => {
            function ani () {
                if (p.value >= 1) {
                    p.value = 0;
                }
                p.value += 0.005;

                canvasDraw();

                requestAnimationFrame(ani);
            }
            ani();

            p5Init();
        });

        return {
            svgParams,
            curSvgParams,
            currentPoint
        };
    }
});
</script>

<style lang="less" scoped>
.contain {
    position: absolute;
	width: 100%;
	height: 100vh;
	background: linear-gradient(
		-225deg,
		#0f0f0f 0%,
		#221d1d 30%,
		#49120b 70%,
		#c02709 100%
	);

    .content {
        position: relative;
        top: 43px;
        width: 100%;
        height: calc(100vh - 43px);
        overflow-y: scroll;
        box-sizing: border-box;
        padding: 12px;
        text-align: center;
    }
}
</style>

<style lang="less" scoped>
</style>

<style lang="scss" scoped>
.scss {
    display: inline-block;
    width: 220px;
    height: 70px;
}

.point {
    width: 1px;
    height: 5px;
    border-radius: 50%;
    background: white;
    display: inline-block;
}
</style>
