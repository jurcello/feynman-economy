<template>
  <div class="money-flow-container">
    <p class="mb-4">This component demonstrates the flow of money between three destinations.</p>
    <button
        @click="moveMoneyToWorkers"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
    >
      Move Money to Workers
    </button>
    <div ref="canvas" class="canvas"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import {MoneyDestination, MoneyDestinationConfig, MoneyBlock, MoneyWorld} from '@/utils/moneySquareUtils';
import * as d3 from "d3";

// Create three money destinations with different configurations
const configCompany = new MoneyDestinationConfig({
  blockSize: 6,
  blocksPerRow: 10,
  blockGutter: 3,
  position: {x: 200, y: 100}
});

const configWorkers = new MoneyDestinationConfig({
  blockSize: 10,
  blocksPerRow: 5,
  blockGutter: 2,
  position: {x: 20, y: 300}
});

const configShareholders = new MoneyDestinationConfig({
  blockSize: 10,
  blocksPerRow: 5,
  blockGutter: 2,
  position: {x: 340, y: 300}
});

const company = new MoneyDestination("Company", 20, configCompany);
const workers = new MoneyDestination("Workers", 0, configWorkers);
const shareholders = new MoneyDestination("Shareholders", 0, configShareholders);

const destinations = [company, workers, shareholders];
const world = new MoneyWorld(destinations);

const canvas = ref<HTMLElement | null>(null);


let redrawBlocks: () => void;
const moveMoneyToWorkers = () => {
  company.moveTo(workers, 10);
  redrawBlocks();
}

// Initialize money destinations
onMounted(() => {
  const svg = d3.select(canvas.value)
      .append("svg")
      .attr("width", 600)
      .attr("height", 400);

  svg.append("g")
      .selectAll("text.title")
      .data(destinations)
      .join("text")
      .attr("class", "title")
      .text(d => d.name)
      .attr("x", d => d.config.position.x)
      .attr("y", d => d.config.position.y + 30)

  const blocksGroup = svg.append("g");

  redrawBlocks = () => {
    svg.selectAll("rect.money-block")
        .data([...MoneyBlock.allBlocks], d => d.id)
        .join(
            enter => {
              console.log("entering")
              return enter
                  .append("rect")
                  .attr("class", "money-block")
                  .attr("fill", "red")
                  .attr("x", d => d.currentPosition.x)
                  .attr("y", d => d.currentPosition.y)
                  .attr("width", 10)
                  .attr("height", 10)
            },
            update => {
              return update.call(
                  update => update.transition()
                      .duration(1000)
                      .delay((_, i) => i * 20)
                      .attr("x", d => d.targetPosition.x > 0 ? d.targetPosition.x : d.currentPosition.x)
                      .attr("y", d => d.targetPosition.y > 0 ? d.targetPosition.y : d.currentPosition.y)
                      .end()
                      .then(() => {
                        MoneyBlock.updateMovingBlocks();
                        console.log("money moved")
                      })
              )
            },
            exit => exit
                // Animate the exit by shrinking height to 0
                .call(exit => exit.transition()
                    .duration(750)
                    .attr("height", 0)
                    .remove()
                )
        )
  }
  redrawBlocks()
});

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