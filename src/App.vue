<template>
    <div id="app">
        <div id="nav">
            <span
                @click="jump('CSSPlayZone')"
                :class="{ active: jug('CSSPlayZone') }"
            >
                CSS实验中心
            </span>
            |
            <span
                @click="jump('DoodleNormal')"
                :class="{ active: jug('DoodleNormal') }"
            >
                巴别塔-普通正交
            </span>
            |
            <span
                @click="jump('DoodlePhy')"
                :class="{ active: jug('DoodlePhy') }"
            >
                巴别塔-物理透视
            </span>
            |
            <span
                @click="jump('RubiksCube')"
                :class="{ active: jug('RubiksCube') }"
            >
                魔方
            </span>
            |
            <span
                @click="jump('SphereHeaven')"
                :class="{ active: jug('SphereHeaven') }"
            >
                球形天堂-beta
            </span>
            |
            <span
                @click="jump('Bezier')"
                :class="{ active: jug('Bezier') }"
            >
                贝塞尔
            </span>
            |
            <span
                @click="jump('Persona')"
                :class="{ active: jug('Persona') }"
            >
                Persona
            </span>
            |
            <span
                @click="jump('TransParentVideo')"
                :class="{ active: jug('TransParentVideo') }"
            >
                透明视频
            </span>
        </div>
        <router-view />
    </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { useHref } from './hooks/app/useHref';

export default defineComponent({
    name: 'app',
    setup() {
        const href = useHref();
        return {
            ...href,
        };
    },
});
</script>

<style lang="less">
body {
    padding: 0;
    margin: 0;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

#nav {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    padding: 10px;
    z-index: 100000;
    font-weight: bold;
    color: #2c3e50;

    span {
        &:hover {
            cursor: pointer;
        }
    }

    .active {
        color: #f1fff9;
    }
}
</style>

<style lang="less">
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background-color: rgba(0, 0, 0, 0);
}

::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0);
}

::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: rgba(41, 41, 41, 0.35);
}
</style>
