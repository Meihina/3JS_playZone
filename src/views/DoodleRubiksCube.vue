<template>
    <sketch :sketch-model="Cube"></sketch>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import Cube from '../model/rubiks_cube';
import Sketch from '../components/Sketch.vue';

export default defineComponent({
    name: 'heaven',
	components: {
        Sketch
    },
    setup () {
        return {
            Cube
        };
    }
});
</script>
