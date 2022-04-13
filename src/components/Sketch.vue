<template>
	<div>
		<div id="container"></div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@vue/composition-api';

export default defineComponent({
    name: 'sketch',
    props: {
        SketchModel: {
            type: Object as any,
            required: true
        }
    },
    setup (props) {
        const sketch = ref<any>(null);
        const init = (): void => {
            sketch.value = new props.SketchModel(
                document.querySelector('#container') as HTMLElement
            );
            sketch.value.init();
            sketch.value.animate();
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
