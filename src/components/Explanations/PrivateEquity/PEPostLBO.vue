<template>
  <p>The current month is: {{ formattedDate }}</p>
  <MoneyFlowCanvas
      :destinations="destinations"
      :width="600"
      :height="400"
      :duration="animationDuration"
      :enable-dragging="false"
      :universe-id="universe"
      ref="flowCanvas"
  />
</template>

<script setup lang="ts">
import {MoneyDestination, MoneyDestinationConfig, UniverseId} from "@/utils/moneySquareUtils";
import MoneyFlowCanvas from "@/components/Drawers/MoneyFlowCanvas.vue";
import {ref, computed} from "vue";
import {Connection, FlowFunctionInsert, Input, MoneyFlowSimulation} from "@/utils/moneyFlowSimulation";
import Timeline = gsap.core.Timeline;

const universe: UniverseId = 'universe2'
const flowCanvas = ref<any>(null);
const blockSize = 3;

const configCompany = new MoneyDestinationConfig({
  blockSize: blockSize,
  blocksPerRow: 18,
  blockGutter: 1,
  position: {x: 278, y: 40},
  showName: true,
  scale: 0.7
});
const company = new MoneyDestination('Company', 0, universe, configCompany);
const configRevenue = new MoneyDestinationConfig({
  blockSize: blockSize,
  blocksPerRow: 18,
  blockGutter: 1,
  position: {x: 278, y: 114},
  showName: true,
  scale: 0.7
});
const revenue = new MoneyDestination('Revenue', 0, universe, configRevenue);
const configWages = new MoneyDestinationConfig({
  blockSize: blockSize,
  blocksPerRow: 18,
  blockGutter: 1,
  position: {x: 84, y: 285},
  showName: true,
  scale: 0.7
});
const wages = new MoneyDestination('Wages', 0, universe, configWages);
const configOtherCosts = new MoneyDestinationConfig({
  blockSize: blockSize,
  blocksPerRow: 18,
  blockGutter: 1,
  position: {x: 269, y: 285},
  showName: true,
  scale: 0.7
});
const otherCosts = new MoneyDestination('Other Costs', 0, universe, configOtherCosts);
const configProfits = new MoneyDestinationConfig({
  blockSize: blockSize,
  blocksPerRow: 18,
  blockGutter: 1,
  position: {x: 441, y: 285},
  showName: true,
  scale: 0.7
});
const profits = new MoneyDestination('Profits', 0, universe, configProfits);

const input = new Input(100);
const cInputCompany = new Connection({from: input, to: company});
const cCompanyRevenue = new Connection({from: company, to: revenue});
const cRevenueWages = new Connection({from: revenue, to: wages, fraction: 0.2});
const cRevenueOtherCosts = new Connection({from: revenue, to: otherCosts, fraction: 0.7});
const cRevenueProfits = new Connection({from: revenue, to: profits, fraction: 0.1});

let redrawBlocks: () => void = () => {
  flowCanvas.value?.redraw?.();
};

let timeline: Timeline | null = null;
const animationDuration = ref<number>(500);

const executeTimeline = () => {
  const moneyFlowSimulation = new MoneyFlowSimulation();

  moneyFlowSimulation
      .addRedrawFunction(redrawBlocks)
      .setAnimationDuration(animationDuration.value)
      .setLoopCallback((loop) => {
        const date = new Date(2024, 0, 1);
        date.setMonth(date.getMonth() + loop);
        currentDate.value = date;
      })
      .addInput(input)
      .addConnection(cInputCompany)
      .addConnection(cCompanyRevenue)
      .addConnection(cRevenueWages)
      .addConnection(cRevenueOtherCosts)
      .addConnection(cRevenueProfits);

  timeline = moneyFlowSimulation.generateTimeline(10);
  timeline.play();
}

const destinations = [company, revenue, wages, otherCosts, profits];

const currentDate = ref<Date>(new Date(2024, 0, 1));

const formattedDate = computed(() => {
  return currentDate.value.toLocaleString('nl-NL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});
const reset = () => {
  timeline?.clear();
  for (const destination of destinations) {
    destination.destroyAllBlocks();
  }
  redrawBlocks();
}


defineExpose({ executeTimeline, reset });
</script>

<style scoped>

</style>