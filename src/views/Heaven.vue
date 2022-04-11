<template>
	<div>
		<div id="container"></div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@vue/composition-api';
import SphereHeaven from '../model/sphere_heaven';

export default defineComponent({
    name: 'heaven',
	components: {},
    setup () {
        const heaven = ref<SphereHeaven | null>(null);

        const init = (): void => {
            heaven.value = new SphereHeaven(
                document.querySelector('#container') as HTMLElement
            );
            heaven.value.init();
            heaven.value.animate();
        };

        onMounted(() => {
            init();
        });
    }
});
</script>

<style lang="less" scoped>
#container {
	position: absolute;
	width: 100%;
	height: 100vh;
    background: rgb(39, 41, 40);
}
</style>
