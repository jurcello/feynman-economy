<template>
  <div class="w-full mx-auto">
    <h2 class="text-2xl font-semibold mb-4 text-center">Monetary Growth Imperative (MGI)</h2>
    <div class="mx-auto w-[760px] max-w-full">
      <MoneyFlowCanvas
        :destinations="destinations"
        :width="731"
        :height="527"
        :duration="800"
        :show-mouse-position="false"
      />
    </div>
    <div class="mt-4 text-center text-sm text-gray-600">
      Money destinations: Banks, Real economy, Stalled money
    </div>
  </div>
</template>

<script setup lang="ts">
import MoneyFlowCanvas from '@/components/Drawers/MoneyFlowCanvas.vue';
import { MoneyDestination, MoneyDestinationConfig } from '@/utils/moneySquareUtils';

// Basic layout parameters (tuned for the 731x527 canvas)
const blockSize = 8;

const banksCfg = new MoneyDestinationConfig({
  blockSize,
  blocksPerRow: 20,
  blockGutter: 2,
  position: { x: 80, y: 180 },
  showName: true,
});

const realEconomyCfg = new MoneyDestinationConfig({
  blockSize,
  blocksPerRow: 24,
  blockGutter: 2,
  position: { x: 280, y: 480 },
  showName: true,
});

const stalledMoneyCfg = new MoneyDestinationConfig({
  blockSize,
  blocksPerRow: 18,
  blockGutter: 2,
  position: { x: 540, y: 260 },
  showName: true,
});

// Create required three destinations with specified names
const banks = new MoneyDestination('Banks', 0, banksCfg);
const realEconomy = new MoneyDestination('Real economy', 0, realEconomyCfg);
const stalledMoney = new MoneyDestination('Stalled money', 0, stalledMoneyCfg);

const destinations: MoneyDestination[] = [
  banks,
  realEconomy,
  stalledMoney,
];
</script>

<style scoped>
</style>
