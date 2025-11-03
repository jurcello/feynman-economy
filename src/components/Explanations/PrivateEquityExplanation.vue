<template>
<h1>private equity explanation</h1>
  <MoneyFlowCanvas
      :destinations="destinations"
      :width="600"
      :height="400"
      :enable-dragging="true"
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
  position: {x: 250, y: 40},
  showName: true,
  scale: 0.7
});
const company = new MoneyDestination('Company', 0, configCompany);
const configRevenue = new MoneyDestinationConfig({
  blockSize: blockSize,
  blocksPerRow: 18,
  blockGutter: 1,
  position: {x: 250, y: 120},
  showName: true,
  scale: 0.7
});
const revenue = new MoneyDestination('Revenue', 0, configRevenue);

let redrawBlocks: () => void = () => {
  flowCanvas.value?.redraw?.();


};

const destinations = [company, revenue];
</script>

<style scoped>

</style>