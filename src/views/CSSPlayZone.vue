<template>
    <div class="contain">
        <div class="content">
            <div class="grahpic">
                <div
                    class="list"
                    :class="`list-${lIdx + 1}`"
                    v-for="(lEle, lIdx) in new Array(3)"
                    :key="`list-${lIdx + 1}`"
                >
                    <div
                        class="point"
                        v-for="(pEle, pIdx) in new Array(pointTotalNumber)"
                        :key="`point-${pIdx}`"
                    ></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';

export default defineComponent({
    setup () {
        const pointTotalNumber = ref<number>(100);
        return {
            pointTotalNumber
        };
    }
});
</script>

<style lang="less" scoped>
.contain {
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

    .content {
        position: relative;
        top: 43px;
        width: 100%;
        height: calc(100vh - 43px);
        overflow-y: scroll;
        box-sizing: border-box;
        padding: 12px;
        text-align: center;
    }
}

.test {
    display: inline-block;
    width: 3px;
    height: 3px;
    background: #000;
    border-radius: 50%;
    animation: ani 3s infinite alternate;
}

@pi: 3.141592653;

.grahpic {
    margin-top: 20px;
    position: relative;
}

.valueSet (@a, @rad) when (@a = 'sin') {
    --value: sin(@rad);
}
.valueSet (@a, @rad) when (@a = 'cos') {
    --value: cos(@rad);
}
.valueSet (@a, @rad) when (@a = 'mix') {
    --value: sin(sin(cos(@rad + @pi + .6)));
}

.keyframesFunc(@name, @rad, @tranType) {
    .valueSet(@tranType, @rad);
    @keyframes @name {
        from {
            transform: translateY(calc(var(--value) * 20px));
        }

        to {
            transform: translateY(calc(var(--value) * -20px));
        }
    }
}

.pointTransFormLoop(@i, @pointNumber, @each, @tranType) when (@i <= @pointNumber) {
    .pointTransFormLoop(@i + 1, @pointNumber, @each, @tranType);
    &:nth-of-type(@{i}) {
        @rad: @each * @i;
        .valueSet(@tranType, @rad);
        .keyframesFunc(pointAnime, @rad, @tranType);
        transform: translateY(calc(var(--value) * 20px));
        animation: pointAnime 1s infinite ease-in-out alternate;
        animation-delay: @i * -.04s;
    }
}

.listBase {
    width: 100%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    @pointNumber: 100;
    @each: @pi / @pointNumber;
}

.pointBase {
    display: inline-block;
    width: 3px;
    height: 10px;
    margin-left: 6px;
}

.list-1 {
    .listBase;
    .point {
        .pointBase;
        .pointTransFormLoop(0, @pointNumber, @each, 'sin');
        background-color: rgb(52, 24, 179);
    }
}

.list-2 {
    .listBase;
    .point {
        .pointBase;
        .pointTransFormLoop(0, @pointNumber, @each, 'cos');
        background-color: rgb(190, 36, 113);
    }
    left: calc(50% + 3px);
}

.list-3 {
    .listBase;
    .point {
        .pointBase;
        .pointTransFormLoop(0, @pointNumber, @each, 'mix');
        background-color: rgb(40, 173, 62);
    }
    left: calc(50% + 6px);
}
</style>
