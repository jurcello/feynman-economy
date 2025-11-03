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
        :enable-dragging="true"
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

const circulatingCfg = new MoneyDestinationConfig({
  blockSize,
  blocksPerRow: 24,
  blockGutter: 2,
  position: { x: 280, y: 480 },
  showName: true,
});

const bankProfitsCfg = new MoneyDestinationConfig({
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
const circulatingMoney = new MoneyDestination('Money in Circulation', 0, circulatingCfg);
const bankProfits = new MoneyDestination('Bank Profits', 0, bankProfitsCfg);
const totalDebt = new MoneyDestination('Total Debt', 0, totalDebtCfg);

const destinations: MoneyDestination[] = [
  banks,
  circulatingMoney,
  bankProfits,
  totalDebt,
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

q.addResetFunction(() => {
  banks.destroyAllBlocks();
  circulatingMoney.destroyAllBlocks();
  bankProfits.destroyAllBlocks();
  totalDebt.destroyAllBlocks();
  redraw();
});

q.add(() => {
  explain('Banks create 20 units of money by lending. This creates equal debt.');
  banks.addMoney(20);
  totalDebt.addMoney(20);
  redraw();
});

q.add(() => {
  explain('The newly created money enters circulation in the economy.');
  banks.moveTo(circulatingMoney, 20);
  redraw();
});

q.add(() => {
  explain('After 1 year: Interest payment of 2 units flows back to banks.');
  circulatingMoney.moveTo(banks, 2);
  redraw();
});

q.add(() => {
  explain('Banks pay 1 unit for operating costs (wages, rent, etc.) - this returns to circulation.');
  banks.moveTo(circulatingMoney, 1);
  redraw();
});

q.add(() => {
  explain('The remaining 1 unit becomes bank profit and is REMOVED from circulation.');
  banks.moveTo(bankProfits, 1);
  redraw();
});

q.add(() => {
  explain(`Result: Only ${circulatingMoney.amount} units remain in circulation. 1 unit permanently removed.`);
  redraw();
});

q.add(() => {
  explain('Year 2: To prevent money supply from shrinking, banks must create new money.');
  banks.addMoney(2);
  totalDebt.addMoney(2);
  redraw();
});

q.add(() => {
  explain('New money enters circulation.');
  banks.moveTo(circulatingMoney, 2);
  redraw();
});

q.add(() => {
  explain('Year 2 interest payment (now on higher debt).');
  circulatingMoney.moveTo(banks, 2);
  redraw();
});

q.add(() => {
  explain('Banks return 1 unit to circulation for costs.');
  banks.moveTo(circulatingMoney, 1);
  redraw();
});

q.add(() => {
  explain('1 unit becomes profit and leaves circulation permanently.');
  banks.moveTo(bankProfits, 1);
  redraw();
});

q.add(() => {
  explain(`Year 3: Must create even more money to maintain circulation.`);
  banks.addMoney(2);
  totalDebt.addMoney(2);
  redraw();
});

q.add(() => {
  explain('Year 3: New money enters circulation.');
  banks.moveTo(circulatingMoney, 2);
  redraw();
});

q.add(() => {
  explain('Year 3 interest payment (debt keeps growing).');
  circulatingMoney.moveTo(banks, 2);
  redraw();
});

q.add(() => {
  explain('Banks return 1 unit to circulation for costs.');
  banks.moveTo(circulatingMoney, 1);
  redraw();
});

q.add(() => {
  explain('1 unit becomes profit and leaves circulation.');
  banks.moveTo(bankProfits, 1);
  redraw();
});

q.add(() => {
  explain(`Key insight: To maintain ${circulatingMoney.amount} units in circulation, debt grew from 20 to ${totalDebt.amount} units. ${bankProfits.amount} units permanently removed. This cycle must continue indefinitely!`);
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
