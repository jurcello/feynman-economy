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
    <div ref="canvas" class="canvas"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import {MoneyDestination, MoneyDestinationConfig, MoneyBlock, MoneyWorld} from '@/utils/moneySquareUtils';
import * as d3 from "d3";
import gsap from "gsap";

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
  blocksPerRow: 15,
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

const canvas = ref<HTMLElement | null>(null);


let redrawBlocks: () => void;
const moveMoneyToWorkers = () => {
  company.moveTo(workers, 10);
  redrawBlocks();
}

const executeTimeline = () => {
  reset();
  const tl = gsap.timeline();
  tl.add(() => {
    company.addMoney(30);
    redrawBlocks();
  })
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
  tl.play();
}

const reset = () => {
  for (const destination of destinations) {
    destination.destroyAllBlocks();
  }
  redrawBlocks();
}

// Initialize money destinations
onMounted(() => {
  const svg = d3.select(canvas.value)
      .append("svg")
      .attr("width", 800)
      .attr("height", 800);

  // Mouse position display element
  const mousePosText = svg.append("text")
      .attr("class", "mouse-position")
      .attr("x", 10)
      .attr("y", 20)
      .attr("fill", "#333")
      .text("x: -, y: -");

  // Update text with mouse coordinates relative to the SVG
  svg.on("mousemove", (event) => {
    const [x, y] = d3.pointer(event);
    mousePosText.text(`x: ${Math.round(x)}, y: ${Math.round(y)}`);
  });

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
                  .attr("x", d => d.position.x)
                  .attr("y", d => d.position.y)
                  .attr("width", d => d.blockSize)
                  .attr("height", d => d.blockSize)
                  .attr("opacity", 0)
                  .call(enter =>
                      enter.transition()
                          .duration(1000)
                          .attr("opacity", 1)
                  )
            },
            update => {
              return update.call(
                  update => update.transition()
                      .duration(1000)
                      .attr("x", d => d.position.x)
                      .attr("y", d => d.position.y)
                      .attr("width", d => d.blockSize)
                      .attr("height", d => d.blockSize)
              )
            },
            exit => exit
                // Animate the exit by shrinking height to 0
                .call(exit => exit.transition()
                    .duration(750)
                    .attr("opacity", 0)
                    .attr("x", d => d.position.x - 40)
                    .attr("y", d => d.position.y + 80)
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