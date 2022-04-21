<template>
    <div class="contain">
        <div class="content">
            <!-- SVG -->
            <div class="svg sketch">
                <div class="title">SVG</div>
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
            <div class="canvas sketch">
                <div class="title">Canvas</div>
                <canvas id="bezier-canvas" width="220" height="70"></canvas>
            </div>

            <!-- 主要作为canvas的上层库 —— p5.js -->
            <div class="p5 sketch">
                <div class="title">P5.js</div>
                <div class="p5sketch"></div>
            </div>

            <!-- dom方案 -->
            <div class="cssWithDom sketch">
                <div class="title">DOM叠堆</div>
                <div class="container">
                    <div
                        class="point"
                        v-for="(ele, idx) in new Array(200)"
                        :key="idx"
                        :style="pointsStyle(idx / 200)"
                    ></div>
                    <div class="cur" :style="{
                        left: `${currentPoint[0] - 11}px`,
                        bottom: `${59 - currentPoint[1]}px`
                    }"> 😅 </div>
                </div>
            </div>

            <!-- box-shadow方案 -->
            <div class="boxShadow sketch">
                <div class="title">SCSS box-shadow</div>
                <div class="container">
                    <div
                        class="scss"
                    ></div>
                </div>
            </div>

            <!-- webgl上层库 —— ThreeJS -->
            <div class="tube-three sketch">
                <div class="title">ThreeJS TubeMesh</div>
                <div id="three-container-tube"></div>
            </div>

            <!-- shader-three -->
            <div class="shader-three sketch">
                <div class="title">ThreeJS Shader</div>
                <div id="three-container-shader"></div>
            </div>

            <!-- shader-p5 -->
            <div class="shader-p5 sketch">
                <div class="title">P5.js Shader</div>
                <div id="p5-container-shader"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from '@vue/composition-api';

import { useKeyPoints } from '../hooks/bezier/useKeyPoints';
import { useSVG, useCanvas, useP5Canvas, useCssDom, useThreeShader, useThreeTube, useP5Shader } from '../hooks/bezier';

export default defineComponent({
    setup () {
        const keyPoints = reactive({
            p1: [10, 60],
            p2: [210, 10],
            cp1: [160, 60]
        });

        const {
            currentPoint
        } = useKeyPoints(keyPoints);

        const SVG = useSVG(keyPoints);
        const cssDom = useCssDom(keyPoints);
        useCanvas(keyPoints);
        useP5Canvas(keyPoints);
        useThreeShader(keyPoints);
        useThreeTube(keyPoints);
        useP5Shader(keyPoints);

        return {
            ...SVG,
            ...cssDom,
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
    background: rgb(39, 41, 40);

    .content {
        display: flex;
        flex-wrap: wrap;
        position: relative;
        top: 43px;
        width: 100%;
        overflow-y: scroll;
        box-sizing: border-box;
        padding: 12px;

        .sketch {
            flex: 33%;
            height: 248px;
        }
    }
}

.title {
    color: white;
    font-weight: 600;
}
</style>

<style lang="less" scoped>
.tube-three {
    text-align: center;
}

#three-container-shader, #three-container-tube {
    display: inline-block;
    width: 220px;
    height: 70px;
}

.cssWithDom {
    display: flex;
    flex-direction: column;
    align-items: center;

    .container {
        position: relative;
        display: inline-block;
        width: 220px;
        height: 70px;

        .point {
            width: 6px;
            height: 4px;
            border-radius: 50%;
            background: white;
            display: inline-block;
            position: absolute;
        }

        .cur {
            position: absolute;
            width: 22px;
            height: 22px;
        }
    }
}
</style>

<style lang="scss" scoped>
@function twoBezier($t, $x1, $y1, $x2, $y2, $cx, $cy) {
    $x: (1 - $t) * (1 - $t) * $x1 + 2 * $t * (1 - $t) * $cx + $t * $t * $x2;
    $y: (1 - $t) * (1 - $t) * $y1 + 2 * $t * (1 - $t) * $cy + $t * $t * $y2;
    @return ($x, $y);
}

:root {
    --currentX: 100px;
}

@function shadowSet($currentX, $x1, $y1, $x2, $y2, $cx, $cy) {
    $shadow : 0 0 0 0 #000;
    $pointsNum: 100;
    @for $i from 0 through $pointsNum {
        $t: ($i + 1) / $pointsNum;
        $point: twoBezier($t ,$x1, $y1, $x2, $y2, $cx, $cy);

        $color: rgb(255, 255, 255);
        @if (nth($point, 1) < $currentX) {
            $color: rgb(255, 145, 0);
        }

        $shadow: $shadow, #{nth($point, 1)} #{nth($point, 2)} 0 0 #{$color};
    }
    @return $shadow;
}

$step: 0.005;
$framesNum: 200;
@keyframes ani {
    @for $i from 0 through $framesNum {
        $X: $i / $framesNum * 200px + 10px;
        #{$i * (100% / $framesNum)} {
            box-shadow: shadowSet($X, 10px, 60px, 210px, 10px, 160px, 60px);
        }
    }
}

.boxShadow {
    .container {
        display: inline-block;
        width: 220px;
        .scss {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            animation: ani 2s infinite;
        }
    }
}
</style>
