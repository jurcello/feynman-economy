<template>
  <div class="money-flow-container">
    <p class="mb-4">This component demonstrates the flow of money between destinations.</p>
    <button
        @click="executeTimeline"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
    >
      Start sequence
    </button>
    <button
        @click="reset"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
    >
      Reset
    </button>
    <MoneyFlowCanvas ref="flowCanvas" :destinations="destinations" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {MoneyDestination, MoneyDestinationConfig, MoneyWorld} from '@/utils/moneySquareUtils';
import gsap from "gsap";
import MoneyFlowCanvas from './MoneyFlowCanvas.vue';

// Create three money destinations with different configurations
const configCompany = new MoneyDestinationConfig({
  blockSize: 4,
  blocksPerRow: 30,
  blockGutter: 1,
  position: {x: 308, y: 100}
});

const configWorkers = new MoneyDestinationConfig({
  blockSize: 4,
  blocksPerRow: 10,
  blockGutter: 2,
  position: {x: 80, y: 250}
});

const configShareholders = new MoneyDestinationConfig({
  blockSize: 4,
  blocksPerRow: 10,
  blockGutter: 1,
  position: {x: 600, y: 400}
});

const configProfit = new MoneyDestinationConfig({
  blockSize: 4,
  blocksPerRow: 15,
  blockGutter: 1,
  position: {x: 600, y: 250}
});

const configEconomy = new MoneyDestinationConfig({
  blockSize: 4,
  blocksPerRow: 45,
  blockGutter: 1,
  position: {x: 80, y: 400}
});

const configCosts = new MoneyDestinationConfig({
  blockSize: 4,
  blocksPerRow: 15,
  blockGutter: 1,
  position: {x: 308, y: 250}
});


const company = new MoneyDestination("Company", 0, configCompany);
const workers = new MoneyDestination("Workers", 0, configWorkers);
const shareholders = new MoneyDestination("Shareholders", 0, configShareholders);
const profit = new MoneyDestination("Profit", 0, configProfit);
const economy = new MoneyDestination("Real economy", 0, configEconomy);
const costs = new MoneyDestination("Costs", 0, configCosts);

const destinations = [company, workers, shareholders, profit, economy, costs];
const world = new MoneyWorld(destinations);

const flowCanvas = ref<any>(null);

let redrawBlocks: () => void = () => {
  flowCanvas.value?.redraw?.();
};
const moveMoneyToWorkers = () => {
  company.moveTo(workers, 10);
  redrawBlocks();
}

const executeTimeline = () => {
  reset();
  const tl = gsap.timeline();
  const repeats = 100;
  tl.add(() => {
    economy.addMoney(300);
    redrawBlocks();
  },  0)

  for (let i = 0; i < repeats; i++) {
    tl.add(() => {
      economy.moveTo(company,30);
      redrawBlocks();
    },  '<1')
    tl.add(() => {
      company.moveTo(workers, 15);
      redrawBlocks();
    }, '<1')
    tl.add(() => {
      company.moveTo(costs, 10);
      redrawBlocks();
    }, '<0')
    tl.add(() => {
      company.moveTo(profit, 5);
      redrawBlocks();
    },'<0')
    tl.add(() => {
      workers.moveTo(economy, 15);
      redrawBlocks();
    }, '<1');
    tl.add(() => {
      costs.moveTo(economy, 10);
      redrawBlocks();
    }, '<1');
    tl.add(() => {
      profit.moveTo(shareholders, 4);
      redrawBlocks();
    }, '<1');
  }
  tl.play();
}

const reset = () => {
  for (const destination of destinations) {
    destination.destroyAllBlocks();
  }
  redrawBlocks();
}


// Clean up animation frame on component unmount
</script>

<style scoped>
.canvas {
  border: 1px solid #ccc;
}
.money-flow-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.money-destinations {
  display: flex;
  justify-content: space-between;
}

.money-destination {
  text-align: center;
}

.money-blocks-container {
  background-color: #f5f5f5;
}
</style>