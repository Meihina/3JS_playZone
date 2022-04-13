<template>
    <sketch :sketch-model="SphereHeaven"></sketch>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import SphereHeaven from '../model/sphere_heaven';
import Sketch from '../components/Sketch.vue';

export default defineComponent({
    name: 'heaven',
	components: {
        Sketch
    },
    setup () {
        return {
            SphereHeaven
        };
    }
});
</script>
