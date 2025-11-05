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

const props = withDefaults(defineProps<{
  iterations?: number
}>(), {
  iterations: 1
})
import MoneyFlowCanvas from "@/components/Drawers/MoneyFlowCanvas.vue";
import {ref, computed} from "vue";
import {Connection, FlowFunctionInsert, Input, MoneyFlowSimulation} from "@/utils/moneyFlowSimulation";
import Timeline = gsap.core.Timeline;

const universe: UniverseId = 'universe1'
const flowCanvas = ref<any>(null);
const blockSize = 3;

const configRevenue = new MoneyDestinationConfig({
  blockSize: blockSize,
  blocksPerRow: 18,
  blockGutter: 1,
  position: {x: 188, y: 7},
  showName: true,
  scale: 0.7
});
const revenue = new MoneyDestination('Revenue', 0, universe, configRevenue);

const configCOGS = new MoneyDestinationConfig({
  blockSize: blockSize,
  blocksPerRow: 40,
  blockGutter: 1,
  position: {x: 20, y: 158},
  showName: true,
  scale: 0.7
});
const cogs = new MoneyDestination('COGS', 0, universe, configCOGS);

const configWages = new MoneyDestinationConfig({
  blockSize: blockSize,
  blocksPerRow: 18,
  blockGutter: 1,
  position: {x: 20, y: 224},
  showName: true,
  scale: 0.7
});
const wages = new MoneyDestination('Wages', 0, universe, configWages);

const configStoreOps = new MoneyDestinationConfig({
  blockSize: blockSize,
  blocksPerRow: 18,
  blockGutter: 1,
  position: {x: 20, y: 290},
  showName: true,
  scale: 0.7
});
const storeOps = new MoneyDestination('Store Operations', 0, universe, configStoreOps);

const configCapEx = new MoneyDestinationConfig({
  blockSize: blockSize,
  blocksPerRow: 18,
  blockGutter: 1,
  position: {x: 20, y: 360},
  showName: true,
  scale: 0.7
});
const capEx = new MoneyDestination('Capital Expenditures', 0, universe, configCapEx);

const configProfits = new MoneyDestinationConfig({
  blockSize: blockSize,
  blocksPerRow: 18,
  blockGutter: 1,
  position: {x: 399, y: 96},
  showName: true,
  scale: 0.7
});
const profits = new MoneyDestination('Profits', 0, universe, configProfits);

const configTaxes = new MoneyDestinationConfig({
  blockSize: blockSize,
  blocksPerRow: 18,
  blockGutter: 1,
  position: {x: 312, y: 197},
  showName: true,
  scale: 0.7
});
const taxes = new MoneyDestination('Taxes', 0, universe, configTaxes);

const configInterest = new MoneyDestinationConfig({
  blockSize: blockSize,
  blocksPerRow: 18,
  blockGutter: 1,
  position: {x: 413, y: 281},
  showName: true,
  scale: 0.7
});
const interest = new MoneyDestination('Interest', 0, universe, configInterest);

const configRetained = new MoneyDestinationConfig({
  blockSize: blockSize,
  blocksPerRow: 18,
  blockGutter: 1,
  position: {x: 437, y: 182},
  showName: true,
  scale: 0.7
});
const retained = new MoneyDestination('Retained Earnings', 0, universe, configRetained);


const input = new Input(100);
const cInputRevenue = new Connection({from: input, to: revenue});
const cRevenueWages = new Connection({from: revenue, to: wages, fraction: 0.12});
const cRevenueCOGS = new Connection({from: revenue, to: cogs, fraction: 0.70});
const cRevenueStoreOps = new Connection({from: revenue, to: storeOps, fraction: 0.10});
const cRevenueCapEx = new Connection({from: revenue, to: capEx, fraction: 0.03});
const cRevenueProfits = new Connection({from: revenue, to: profits, fraction: 0.05});
const cRevenueTaxes = new Connection({from: profits, to: taxes, fraction: 0.35});
const cRevenueInterest = new Connection({from: profits, to: interest, fraction: 0.05});
const cRevenueRetained = new Connection({from: profits, to: retained, fraction: 0.60});

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
      .addConnection(cInputRevenue)
      .addConnection(cRevenueCOGS)
      .addConnection(cRevenueWages)
      .addConnection(cRevenueStoreOps)
      .addConnection(cRevenueCapEx)
      .addConnection(cRevenueProfits)
      .addConnection(cRevenueTaxes)
      .addConnection(cRevenueInterest)
      .addConnection(cRevenueRetained);

  timeline = moneyFlowSimulation.generateTimeline(props.iterations);
  timeline.play();
}

const destinations = [revenue, wages, profits, cogs, storeOps, capEx, taxes, interest, retained];

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