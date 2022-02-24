<template>
    <div id="app">
        <div id="nav">
            <span @click="jump('/DoodleNormal')" :class="{ active: jug('/DoodleNormal') }">巴别塔-普通正交</span> |
            <span @click="jump('/DoodlePhy')" :class="{ active: jug('/DoodlePhy') }">巴别塔-物理透视</span>
        </div>
        <router-view/>
    </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
    name: 'doodle-phy',
	components: {},
    setup () {
        // 使用window来切换路由，可以直接干掉所有ThreeJS的残留对象，保护内存
		const jump = (path: string): void => {
            window.location.href = 'http://' + window.location.host + path;
        };

        const jug = (path: string): boolean => {
            console.log(window.location.pathname, path);
            return window.location.pathname === path;
        };

        return {
			jump,
            jug
		};
    }
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
