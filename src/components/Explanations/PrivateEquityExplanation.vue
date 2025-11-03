<template>
<h1>private equity explanation</h1>
  <MoneyFlowCanvas
      :destinations="destinations"
      :width="600"
      :height="400"
      :enable-dragging="false"
  />
</template>

<script setup lang="ts">
import {MoneyDestination, MoneyDestinationConfig} from "@/utils/moneySquareUtils";
import MoneyFlowCanvas from "@/components/Drawers/MoneyFlowCanvas.vue";
import {ref} from "vue";

const flowCanvas = ref<any>(null);
const blockSize = 6;

const configCompany = new MoneyDestinationConfig({
  blockSize: blockSize,
  blocksPerRow: 18,
  blockGutter: 1,
  position: {x: 278, y: 40},
  showName: true,
  scale: 0.7
});
const company = new MoneyDestination('Company', 0, configCompany);
const configRevenue = new MoneyDestinationConfig({
  blockSize: blockSize,
  blocksPerRow: 18,
  blockGutter: 1,
  position: {x: 278, y: 114},
  showName: true,
  scale: 0.7
});
const revenue = new MoneyDestination('Revenue', 0, configRevenue);
const configWages = new MoneyDestinationConfig({
  blockSize: blockSize,
  blocksPerRow: 18,
  blockGutter: 1,
  position: {x: 84, y: 223},
  showName: true,
  scale: 0.7
});
const wages = new MoneyDestination('Wages', 0, configWages);
const configOtherCosts = new MoneyDestinationConfig({
  blockSize: blockSize,
  blocksPerRow: 18,
  blockGutter: 1,
  position: {x: 269, y: 223},
  showName: true,
  scale: 0.7
});
const otherCosts = new MoneyDestination('Other Costs', 0, configOtherCosts);
const configProfits = new MoneyDestinationConfig({
  blockSize: blockSize,
  blocksPerRow: 18,
  blockGutter: 1,
  position: {x: 441, y: 223},
  showName: true,
  scale: 0.7
});
const profits = new MoneyDestination('Profits', 0, configProfits);

let redrawBlocks: () => void = () => {
  flowCanvas.value?.redraw?.();


};

const destinations = [company, revenue, wages, otherCosts, profits];
</script>

<style scoped>

</style>