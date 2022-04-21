<template>
	<div>
		<div id="container"></div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@vue/composition-api';

export default defineComponent({
    name: 'sketch',
    props: {
        SketchModel: {
            type: Function as any,
            required: true
        }
    },
    setup (props) {
        const init = (): void => {
            const sketch = new props.SketchModel(
                document.querySelector('#container') as HTMLElement
            );
            sketch.init();
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
