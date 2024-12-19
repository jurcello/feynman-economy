<template>
  <!-- Container to render the p5 canvas -->
  <div ref="canvasContainer"></div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from "vue";
import p5 from "p5";
import createSkatch from "../sketch";

export default defineComponent({
  name: "P5Sketch",
  setup() {
    // Reference for the canvas container
    const canvasContainer = ref<HTMLDivElement | null>(null);

    // Variable to store the p5 instance
    let p5Instance: p5 | null = null;

    // p5 sketch function

    // Lifecycle: Initialize p5 when component is mounted
    onMounted(() => {
      if (canvasContainer.value) {
        const sketch = createSkatch(canvasContainer.value);
        p5Instance = new p5(sketch, canvasContainer.value); // Attach sketch to div
      }
    });

    // Lifecycle: Destroy p5 instance when component is unmounted
    onUnmounted(() => {
      if (p5Instance) {
        p5Instance.remove(); // Clean up canvas and memory
      }
    });

    return {
      canvasContainer,
    };
  },
});
</script>

<style scoped>
/* Optional styling for the canvas container */
div {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>