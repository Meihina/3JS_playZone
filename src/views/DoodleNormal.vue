<template>
	<div>
		<div id="container"></div>
		<div class="title" @click="handleBegin" :style="{ fontSize: isPhone? '44px': '88px' }">
			{{ isStart ? isFailed ? '输了啦，菜菜' : doodle.score : 'Begin' }}
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed, onUnmounted } from '@vue/composition-api';
import Doodle from '../model/doodle';

export default defineComponent({
    name: 'main-contain',
	components: {},
    setup () {
		const doodle = ref<Doodle | null>(null);
		const isStart = ref<boolean>(false);

		const isFailed = computed(() => {
            return doodle.value!.isFailed;
        });

		const isPhone = computed(() => {
			return /Mobi|Android|iPhone/i.test(navigator.userAgent);
		});

		const init = (): void => {
			doodle.value = new Doodle(
				document.querySelector('#container') as HTMLElement
			);
            doodle.value.init();
			doodle.value.animate();
		};

		const reStart = (): void => {
			isStart.value = false;
			doodle.value!.restart();
		};

		const handleBegin = (): void => {
			if (!isStart.value) {
				doodle.value!.start();
				isStart.value = true;
			}

			if (isFailed.value) {
				reStart();
			}
		};

		const setClickEvt = (): void => {
			document.querySelector('#container')?.addEventListener('click', () => {
				if (isStart.value && !doodle.value!.isFailed) {
					doodle.value!.doodleDrop();
				}
			});
		};

		onMounted(() => {
			init();
			setClickEvt();
        });

		onUnmounted(() => {
			doodle.value?.clear();
			doodle.value = null;
		});

        return {
			doodle,
			isStart,
			isFailed,
			isPhone,
			handleBegin
		};
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
		#6955c4 0%,
		#8174b9 30%,
		#ac6d90 70%,
		#ad5184 100%
	);
}

.title {
	position: absolute;
	top: 32px;
	left: 0;
	right: 0;
	color: rgb(255, 255, 255);
	font-size: 88px;
	transition: 0.3s;
	cursor: pointer;
	&:hover {
		font-size: 92px;
		text-shadow: 0 0 14px white;
	}
}
</style>
