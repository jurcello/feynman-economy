<template>
<h1>private equity explanation</h1>
  <MoneyFlowCanvas
      :destinations="destinations"
      :width="600"
      :height="400"
      :duration="animationDuration"
      :enable-dragging="false"
      ref="flowCanvas"
  />
  <button
      @click="executeTimeline"
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
  >
    Start sequence
  </button>
</template>

<script setup lang="ts">
import {MoneyDestination, MoneyDestinationConfig} from "@/utils/moneySquareUtils";
import MoneyFlowCanvas from "@/components/Drawers/MoneyFlowCanvas.vue";
import {ref} from "vue";
import {Connection, Input, MoneyFlowSimulation} from "@/utils/moneyFlowSimulation";

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

const input = new Input(10);
const cInputCompany = new Connection({from: input, to: company});
const cCompanyRevenue = new Connection({from: company, to: revenue});
const cRevenueWages = new Connection({from: revenue, to: wages, fraction: 0.4});
const cRevenueOtherCosts = new Connection({from: revenue, to: otherCosts, fraction: 0.5});
const cRevenueProfits = new Connection({from: revenue, to: profits, fraction: 0.1});

let redrawBlocks: () => void = () => {
  flowCanvas.value?.redraw?.();
};

const animationDuration = ref<number>(500);

const moneyFlowSimulation = new MoneyFlowSimulation();
moneyFlowSimulation
    .addRedrawFunction(redrawBlocks)
    .setFlowDuration(animationDuration.value)
    .addInput(input)
    .addConnection(cInputCompany)
    .addConnection(cCompanyRevenue)
    .addConnection(cRevenueWages)
    .addConnection(cRevenueOtherCosts)
    .addConnection(cRevenueProfits);

const executeTimeline = () => {
  const timeline = moneyFlowSimulation.generateTimeline(5);
  timeline.play();
}


const destinations = [company, revenue, wages, otherCosts, profits];
</script>

<style scoped>

</style>