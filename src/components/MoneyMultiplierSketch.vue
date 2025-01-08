<template>
  <div class="canvas" ref="canvasContainer">
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";
import p5 from "p5";
import moneyMultiplier from "@/sketches/moneyMultiplier";
import Money from "@/sketches/Animatables/Money";
import Society from "@/sketches/Animatables/Society";

const canvasContainer = ref<HTMLDivElement | null>(null);
let p5Instance: p5 | null = null;

let money: Money;
let society: Society

onMounted(() => {
  if (canvasContainer.value) {
    const sketch = moneyMultiplier(canvasContainer.value, ["bank1", "bank2"], (result) => {
      money = result.money;
      society = result.society;

      society.getBalanceDrawer("bank1")
    });
    p5Instance = new p5(sketch, canvasContainer.value);
  }
});

// Lifecycle: Destroy p5 instance when component is unmounted
onUnmounted(() => {
  if (p5Instance) {
    p5Instance.remove(); // Clean up canvas and memory
  }
});

</script>

<style scoped>
.canvas {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>