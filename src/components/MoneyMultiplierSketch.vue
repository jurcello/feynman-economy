<template>
  <p>Hi all

  </p>
  <p><button @click="depositToBank1" class="btn">Stort geld in bank 1</button></p>
  <div class="canvas" ref="canvasContainer">
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";
import p5 from "p5";
import moneyMultiplier from "@/sketches/moneyMultiplier";
import Money from "@/sketches/Animatables/Money";
import Society from "@/sketches/Animatables/Society";
import BalanceDrawerExtended from "@/sketches/Animatables/BalanceDrawerExtended";
import {CreditTypes, DebitTypes, Transaction} from "@/balance";

const canvasContainer = ref<HTMLDivElement | null>(null);
let p5Instance: p5 | null = null;

let money: Money;
let society: Society;
let bank1: BalanceDrawerExtended;
let bank2: BalanceDrawerExtended;

onMounted(() => {
  if (canvasContainer.value) {
    const sketch = moneyMultiplier(canvasContainer.value, ["bank1", "bank2"], (result) => {
      money = result.money;
      society = result.society;

      bank1 = society.getBalanceDrawer("bank1");
      bank2 = society.getBalanceDrawer("bank2");
      bank1.properties.positionY = 480;
      bank2.properties.positionY = 480;
      bank2.properties.positionX = 800;
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

const depositToBank1 = () => {
  money.moveFromTo(
    {
      x: 550,
      y: 10
    },
    {
      x: bank1.getPosition().x,
      y: bank1.getPosition().y,
    }).then(() => {
      const transaction = new Transaction("storting", 200, { type: DebitTypes.cash }, { type: CreditTypes.creditAccount});
      bank1.balance.addTransaction(transaction);
  })
}

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