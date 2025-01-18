<template>
  <h3>Geld creatie uitgelegd door de Bank of England</h3>
  <div class="canvas" ref="canvasContainer">
  </div>
</template>

<script setup lang="ts">
import createSketch from "@/sketches/moneyCreationBOE";
import {onMounted, ref} from "vue";
import Society from "@/sketches/Animatables/Society";
import p5 from "p5";

const canvasContainer = ref<HTMLDivElement | null>(null);
let society: Society;
let p5Instance: p5 | null = null;

onMounted(() => {
  const width = 600;
  const height = 600;

  const banks = [
      "Centrale Bank",
      "Commerciele Bank",
      "Persoon"
  ]

  if (canvasContainer.value) {
    const sketch = createSketch(canvasContainer.value, width, height, banks, (result) => {
      society = result.society;
    });
    p5Instance = new p5(sketch, canvasContainer.value);
  }
})
</script>

<style scoped>

</style>