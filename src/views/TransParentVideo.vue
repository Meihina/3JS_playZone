<template>
    <div class="contain">
        <div class="content">
            <video
                id="video"
                src="http://f1.iplay.126.net/LTg4MDA1/c62f8e1f15e98ff9eb9a094d015db380.mp4"
                controls="true"
            />
            <canvas id="canvas1"></canvas>
            <canvas id="canvas2"></canvas>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@vue/composition-api';

export default defineComponent({
    setup() {
        const video = ref<any>();
        const canvas1 = ref<any>();
        const canvas2 = ref<any>();
        const frame = ref<any>({
            width: 0,
            height: 0,
        });

        const computeFrame = () => {
            canvas1.value.width = frame.value.width;
            canvas2.value.width = frame.value.width;
            canvas1.value.height = frame.value.height;
            canvas2.value.height = frame.value.height;

            const ctx = canvas1.value.getContext('2d');
            ctx.drawImage(video.value, 0, 0, frame.value.width, frame.value.height);
            const u8Image = ctx.getImageData(0, 0, frame.value.width, frame.value.height);

            const l = u8Image.data.length / 4;
            for (let i = 0; i < l; i++) {
                const r = u8Image.data[i * 4 + 0];
                const g = u8Image.data[i * 4 + 1];
                const b = u8Image.data[i * 4 + 2];
                if (g > 100 && r > 100 && b < 43) u8Image.data[i * 4 + 3] = 0;
            }

            console.log(u8Image);

            const ctx2 = canvas2.value.getContext('2d');
            ctx2.putImageData(u8Image, 0, 0);
            const result = canvas2.value.toDataURL('image/jpeg');

            console.log(result);
        };

        const timer = () => {
            if (video.value?.paused || video.value?.ended) {
                return;
            }
            computeFrame();
            setTimeout(() => {
                timer();
            }, 0);
        };

        onMounted(() => {
            video.value = document.getElementById('video') as HTMLVideoElement;
            canvas1.value = document.getElementById('canvas1') as HTMLCanvasElement;
            canvas2.value = document.getElementById('canvas2') as HTMLCanvasElement;

            video.value.volume = 0;
            video.value.muted = true;
            video.value.setAttribute('x-webkit-airplay', 'true');
            video.value.setAttribute('webkit-playsinline', 'true');
            video.value.setAttribute('playsinline', 'true');
            video.value.crossOrigin = 'anonymous';

            video.value?.addEventListener('canplay', () => {
                video.value?.play();
            });
            video.value?.addEventListener(
                'play',
                () => {
                    frame.value = {
                        width: video.value?.videoWidth ?? 0 / 2,
                        height: video.value?.videoHeight ?? 0 / 2,
                    };
                    timer();
                },
                false,
            );
        });

        return {};
    },
});
</script>

<style lang="less" scoped>
.contain {
    position: absolute;
    width: 100%;
    height: 100vh;
    background: linear-gradient(-225deg, #0f0f0f 0%, #221d1d 30%, #49120b 70%, #c02709 100%);

    .content {
        position: relative;
        top: 43px;
        width: 100%;
        height: calc(100vh - 43px);
        overflow-y: scroll;
        box-sizing: border-box;
        padding: 12px;
        text-align: center;

        #video,
        #canvas1 {
            display: none;
        }
    }
}
</style>
