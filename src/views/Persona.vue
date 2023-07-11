<template>
    <div class="contain">
        <div class="content"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
    setup() {
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
    }
}
</style>
