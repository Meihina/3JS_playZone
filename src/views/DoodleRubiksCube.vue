<template>
	<div>
		<div id="container"></div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@vue/composition-api';
import Cube from '../model/rubiks_cube';

export default defineComponent({
    name: 'doodle-cube',
	components: {},
    setup () {
        const cube = ref<Cube | null>(null);

		const init = (): void => {
			cube.value = new Cube(
				document.querySelector('#container') as HTMLElement
			);
            cube.value.init();
			cube.value.animate();
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
	background: linear-gradient(
		-225deg,
		#cbc4eb 0%,
		#7166ac 30%,
		#3f357a 70%,
		#130a47 100%
	);
}
</style>
