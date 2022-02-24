<template>
	<div>
		<div id="container"></div>
		<div class="title" @click="handleBegin" :style="textSizeStyle">
			{{ isStart
				? isFailed ? `Failed, you got ${doodle.score}, click here retry.` : `Score: ${doodle.score}, HP: ${doodle.curHp}`
				: 'Begin'
			}}
			<div v-if="!isPhone" class="tip">PC端请点击 ↓ 使积木下落</div>
		</div>
        <div
            v-if="isStart && !isFailed"
            class="add_next"
            @click="handleAdd"
            :style="textSizeStyle"
        >
            增加下一块积木
        </div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, onUnmounted } from '@vue/composition-api';
import Doodle from '../model/doodle_phy';

export default defineComponent({
    name: 'doodle-phy',
	components: {},
    setup () {
		const doodle = ref<Doodle | null>(null);

		const isFailed = computed(() => {
            return doodle.value ? doodle.value!.isFailed : false;
        });

        const isStart = computed(() => {
            return doodle.value ? doodle.value!.isStart : false;
        });

        const isPhone = computed(() => {
			return /Mobi|Android|iPhone/i.test(navigator.userAgent);
		});

		const textSizeStyle = computed(() => {
			return { fontSize: isPhone.value ? '32px' : '64px' };
		});

		const init = (): void => {
			doodle.value = new Doodle(
				document.querySelector('#container') as HTMLElement
			);
            doodle.value.init();
			doodle.value.animate();
		};

        const setClickEvt = (): void => {
			if (isPhone.value) {
				document.querySelector('#container')?.addEventListener('click', () => {
					handleDrop();
				});
			} else {
				document.onkeydown = (e: any) => {
					if (e.keyCode === 40) {
						handleDrop();
					}
				};
			}
		};

        const handleBegin = (): void => {
            if (isStart.value && !isFailed.value) {
                return;
            }

			if (isFailed.value) {
				doodle.value?.restart();
				return;
			}

            doodle.value?.start();
        };

        const handleAdd = (): void => {
            doodle.value?.addNext();
        };

		const handleDrop = (): void => {
			if (isStart.value && !doodle.value!.isFailed) {
				doodle.value!.itemDropDown();
			}
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
            isFailed,
            isStart,
            isPhone,
            handleBegin,
            handleAdd,
			textSizeStyle
		};
    }
});
</script>

<style lang="less">
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

.text {
    position: absolute;
	left: 0;
	right: 0;
	color: rgb(255, 255, 255);
	font-size: 78px;
	transition: 0.3s;
	cursor: pointer;
	&:hover {
		text-shadow: 0 0 14px white;
	}
}

.title {
    .text();
	top: 32px;
}

.add_next {
    .text();
    bottom: 0;
}

.tip {
	.text();
	font-size: 16px;
}
</style>
