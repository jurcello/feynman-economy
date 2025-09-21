<template>
  <div class="w-2/3 mx-auto">
    <h2 class="text-2xl font-semibold mb-4 text-center">Monetary Growth Imperative (MGI)</h2>
    <p>The next bit assumes only banks are involved getting money out of the system</p>
    <div class="mb-4 flex justify-center gap-3">
      <button @click="onNext" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">Next</button>
      <button @click="onReset" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">Reset</button>
    </div>

    <!-- Dynamic explanation area -->
    <div class="mb-4 mx-auto w-[760px] max-w-full">
      <div class="rounded border border-gray-300 bg-gray-50 p-3">
        <p data-testid="mgi-explanation">{{ explanationText }}</p>
      </div>
    </div>

    <div class="mx-auto w-[760px] max-w-full">
      <MoneyFlowCanvas
        ref="flowCanvas"
        :destinations="destinations"
        :width="731"
        :height="527"
        :duration="animationDuration"
        :show-mouse-position="true"
      />
    </div>
    <!-- Simple indicators for block counts per destination -->
    <div class="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm">
      <div v-for="d in destinations" :key="d.name + '-' + uiTick" class="px-2 py-1 rounded border border-gray-300 bg-white shadow-sm">
        <span class="font-medium">{{ d.name }}:</span>
        <span :data-testid="`indicator-${d.name.replace(/\\s+/g, '-')}`" class="ml-1">{{ d.amount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MoneyFlowCanvas from '@/components/Drawers/MoneyFlowCanvas.vue';
import { MoneyDestination, MoneyDestinationConfig } from '@/utils/moneySquareUtils';
import { createFunctionQueue } from '@/utils/functionQueue';

// Basic layout parameters (tuned for the 731x527 canvas)
const blockSize = 8;

const banksCfg = new MoneyDestinationConfig({
  blockSize,
  blocksPerRow: 20,
  blockGutter: 2,
  position: { x: 80, y: 260 },
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

const totalDebtCfg = new MoneyDestinationConfig({
  blockSize,
  blocksPerRow: 20,
  blockGutter: 2,
  position: { x: 440, y: 100 },
  showName: true,
  color: '#ea3636'
});

const gdpCfg = new MoneyDestinationConfig({
  blockSize,
  blocksPerRow: 24,
  blockGutter: 2,
  position: { x: 80, y: 100 },
  showName: true,
  color: '#428c07'
});

const banks = new MoneyDestination('Banks', 0, banksCfg);
const realEconomy = new MoneyDestination('Real economy', 0, realEconomyCfg);
const stalledMoney = new MoneyDestination('Stalled money', 0, stalledMoneyCfg);
const totalDebt = new MoneyDestination('Total debt', 0, totalDebtCfg);
const gdp = new MoneyDestination('GDP', 0, gdpCfg);

const destinations: MoneyDestination[] = [
  banks,
  realEconomy,
  stalledMoney,
  totalDebt,
  gdp,
];

const flowCanvas = ref<any>(null);
const animationDuration = ref<number>(800);

// Explanation text and function to update it
const explanationText = ref<string>('Use Next to step through the sequence.');
const explain = (text: string) => {
  explanationText.value = text;
};

const uiTick = ref(0);
const bump = () => uiTick.value++;
const redraw = () => { flowCanvas.value?.redraw?.(); bump(); };

const q = createFunctionQueue();

const calculateGDP = (realEconomyAmount: number, velocityFactor: number = 2.5) => {
  return realEconomyAmount * velocityFactor;
};

// Update GDP display whenever real economy changes
const updateGDP = () => {
  const gdpValue = calculateGDP(realEconomy.amount);
  const difference = gdpValue - gdp.amount;
  if (difference > 0) {
    gdp.addMoney(Math.round(difference));
  }
  else if (difference < 0) {
    gdp.destroyBlocks(Math.round(-difference));
  }
};

q.addResetFunction(() => {
  banks.destroyAllBlocks();
  realEconomy.destroyAllBlocks();
  stalledMoney.destroyAllBlocks();
  totalDebt.destroyAllBlocks();
  gdp.destroyAllBlocks();
  redraw();
});

q.add(() => {
  explain('We start with the banks creating some money. This money is equal to the debt.');
  banks.addMoney(20);
  totalDebt.addMoney(20);
  updateGDP();
  redraw();
});

q.add(() => {
  explain('The banks then move the money to the real economy by a deposit.');
  banks.moveTo(realEconomy, 20);
  redraw();
});

q.add(() => {
  explain(`With 20 units in the real economy, GDP is ${calculateGDP(20)} (using velocity factor of 2.5).`);
  // GDP already updated in previous step
  redraw();
});

q.add(() => {
  explain('Each year some of the debt has to be paid off to the banks.');
  realEconomy.moveTo(banks, 1);
  updateGDP();
  redraw();
});

q.add(() => {
  explain('This money disappears again by definition.');
  banks.destroyBlocks(1);
  totalDebt.destroyBlocks(1);
  redraw();
});

q.add(() => {
  explain('Also each year interest has to be paid off to the banks.');
  realEconomy.moveTo(banks, 1);
  updateGDP();
  redraw();
});

q.add(() => {
  explain('For the sake of simplicity we assume that the banks give this money to its shareholders.');
  banks.moveTo(stalledMoney, 1);
  redraw();
});

q.add(() => {
  explain(`After Year 1: Real economy has ${realEconomy.amount} units, GDP is ${calculateGDP(realEconomy.amount)}. Notice GDP dropped from 50 to ${calculateGDP(realEconomy.amount)}.`);
  redraw();
});

// YEAR 2 - First additional cycle
q.add(() => {
  explain('Year 2: To maintain economic activity, banks must create new money. Let\'s add 3 new units.');
  banks.addMoney(3);
  totalDebt.addMoney(3);
  redraw();
});

q.add(() => {
  explain('New money flows to the real economy.');
  banks.moveTo(realEconomy, 3);
  updateGDP();
  redraw();
});

q.add(() => {
  explain(`Real economy now has ${realEconomy.amount} units, GDP is ${calculateGDP(realEconomy.amount)}. But debt servicing continues...`);
  redraw();
});

q.add(() => {
  explain('Year 2 debt repayment (now higher total debt means higher payments).');
  realEconomy.moveTo(banks, 1);
  updateGDP();
  redraw();
});

q.add(() => {
  explain('Debt money disappears.');
  banks.destroyBlocks(1);
  totalDebt.destroyBlocks(1);
  redraw();
});

q.add(() => {
  explain('Year 2 interest payment.');
  realEconomy.moveTo(banks, 1);
  updateGDP();
  redraw();
});

q.add(() => {
  explain('Interest goes to stalled money.');
  banks.moveTo(stalledMoney, 1);
  redraw();
});

// YEAR 3 - Second additional cycle
q.add(() => {
  explain('Year 3: Even more new money needed to compensate for ongoing outflows.');
  banks.addMoney(4);
  totalDebt.addMoney(4);
  redraw();
});

q.add(() => {
  explain('New money to real economy.');
  banks.moveTo(realEconomy, 4);
  updateGDP();
  redraw();
});

q.add(() => {
  explain('Year 3 debt repayment (now from even higher debt level).');
  realEconomy.moveTo(banks, 1);
  updateGDP();
  redraw();
});

q.add(() => {
  explain('Debt money disappears.');
  banks.destroyBlocks(1);
  totalDebt.destroyBlocks(1);
  redraw();
});

q.add(() => {
  explain('Year 3 interest payment.');
  realEconomy.moveTo(banks, 1);
  updateGDP();
  redraw();
});

q.add(() => {
  explain('Interest to stalled money.');
  banks.moveTo(stalledMoney, 1);
  redraw();
});

q.add(() => {
  explain(`Final result: Real economy has ${realEconomy.amount} units (GDP: ${calculateGDP(realEconomy.amount)}), but total debt grew from 20 to ${totalDebt.amount}, and ${stalledMoney.amount} units are stalled. Growth imperative demonstrated!`);
  redraw();
});

const onNext = () => {
  q.next();
};

const onReset = () => {
  q.reset();
};

// Expose the explain function so parents/tests can update the text easily
// Usage example from a parent: const r = ref(); r.value?.explain('New text');
defineExpose({ explain });
</script>

<style scoped>
</style>
