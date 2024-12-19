<template>
  <p>In het begin van je leven heb je nog geen eigen geld. Pas als je wat ouder bent, krijg je voor het eerst zakgeld.
    Dit is het begin van je leven als consument. Druk op de knop om zakgeld te krijgen (in cash).
  </p>
  <p><button @click="addPocketMoney" class="btn" :disabled="hasPocketMoneyBeenGiven">Krijg € 50,- zakgeld</button></p>
  <div ref="canvasContainer"></div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from "vue";
import p5 from "p5";
import oneBalanceSketch from "../sketches/oneBalanceSketch";
import {Balance, CreditTypes, DebitTypes, Transaction} from "../balance";

export default defineComponent({
  name: "BalanceExplanationSketch",
  setup() {
    const canvasContainer = ref<HTMLDivElement | null>(null);

    let p5Instance: p5 | null = null;
    const balance = new Balance("Jantje")


    const hasPocketMoneyBeenGiven = ref<boolean>(false);
    const addPocketMoney = () => {
      const transaction = new Transaction("First pocket money", 50, { type: DebitTypes.cash }, { type: CreditTypes.equity });
      balance.addTransaction(transaction);
      hasPocketMoneyBeenGiven.value = true;
    }

    onMounted(() => {
      if (canvasContainer.value) {
        const sketch = oneBalanceSketch(canvasContainer.value, balance);
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
      addPocketMoney,
      hasPocketMoneyBeenGiven,
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