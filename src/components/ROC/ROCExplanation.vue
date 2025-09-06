<template>
  <div class="w-2/3 mx-auto">
    <h2 class="text-2xl font-semibold mb-4">ROC</h2>
    <p class="mb-2">This is the ROC explanation/visualization component.</p>

    <!-- Controls -->
    <div class="mt-4 space-y-3">
      <div>
        <label for="roc-slider" class="block text-sm font-medium text-gray-700 mb-1">
          gapwidth: {{ gapWidth }}
        </label>
        <input
          id="roc-slider"
          type="range"
          min="0"
          max="0.5"
          step="0.001"
          v-model.number="gapWidth"
          class="w-full"
          aria-label="roc-slider"
          @change="redraw"
        />
      </div>
      <div>
        <label for="capital-slider" class="block text-sm font-medium text-gray-700 mb-1">
          capital amount: {{ capitalAmount }}
        </label>
        <input
            id="capital-slider"
            type="range"
            min="0"
            max="300"
            step="1"
            v-model.number="capitalAmount"
            class="w-full"
            aria-label="capital-slider"
            @change="redraw"
        />
      </div>
      <div>
        <label for="profit-slider" class="block text-sm font-medium text-gray-700 mb-1">
          profit amount: {{ profitAmount }}
        </label>
        <input
            id="profit-slider"
            type="range"
            min="0"
            max="40"
            step="0.1"
            v-model.number="profitAmount"
            class="w-full"
            aria-label="profit-slider"
            @change="redraw"
        />
      </div>
      <label class="inline-flex items-center space-x-2">
        <input type="checkbox" v-model="showBlocks" aria-label="show-blocks" />
        <span>Show percentage visualisation</span>
      </label>
      <div>Percentage: {{ percentage }} %</div>
    </div>

    <div class="mt-6">
      <div ref="container" aria-label="roc-bar" role="img"></div>
      <p class="text-xs text-gray-500 mt-2">100 blocks rendered with d3.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import * as d3 from 'd3';

const container = ref<HTMLElement | null>(null);
let svg: d3.Selection<SVGSVGElement, unknown, null, undefined> | null = null;

const gapWidth = ref<number>(0);
const showBlocks = ref<boolean>(false);
const capitalAmount = ref<number>(200);
const profitAmount = ref<number>(20);
const percentage = ref<number>(0);

// constants for the grid
const blocks = 100;
const cols = 10;
const rows = Math.ceil(blocks / cols);
const blockSize = 20;

// Scales defined at module scope to reuse in watchers
// Use scaleBand to compute band positions and sizes; ranges are in pixels

// Type for a precomputed block
type Block = {
  x: number;
  y: number;
  width: number;
  height: number
};

let capitalBlocks: Block[] = [];
let profitBlocks: Block[] = [];

let recalculate = () => {
  percentage.value = (profitAmount.value / capitalAmount.value) * 100;
}

// Redraw function (restored): computes data and updates the SVG
let redraw = () => {
  recalculate()
  let width;
  let height;
  let xOffset = 0;
  const initialWidth = 100;
  if (showBlocks.value) {
    width = cols * blockSize;
    height = rows * blockSize;
    gapWidth.value = 0.15;
    xOffset = 400;
  }
  else {
    width = initialWidth;
    height = capitalAmount.value;
    gapWidth.value = 0;
  }

  const xScale = d3.scaleBand<number>().domain(d3.range(cols)).range([0, width]).paddingInner(gapWidth.value).paddingOuter(0);
  const yScale = d3.scaleBand<number>().domain(d3.range(rows)).range([0, height]).paddingInner(gapWidth.value).paddingOuter(0);

  if (!svg) return;

  // Precompute block objects with intrinsic x, y, width, height
  capitalBlocks = d3.range(blocks).map((i) => {
    const c = i % cols;
    const r = Math.floor(i / cols);
    const x = xScale(c)! + xOffset;
    const y = 300 - (yScale(r)! + yScale.bandwidth());
    if (r === 0 && c === 0) console.log(y)
    return { x, y, width: xScale.bandwidth(), height: yScale.bandwidth() };
  });

  const widthPerUnitForProfit = initialWidth / percentage.value;

  profitBlocks = d3.range(Math.ceil(percentage.value)).map((i) => {
    const c = i % cols;
    const r = Math.floor(i / cols);
    let x, y, width, height;

    if (showBlocks.value) {
      x = xScale(c)! + xOffset;
      y = 300 - (yScale(r)! + yScale.bandwidth());
      width = xScale.bandwidth();
      height = yScale.bandwidth();
      if (i === Math.ceil(percentage.value - 1)) {
        width = xScale.bandwidth() * (percentage.value % 1);
      }
    } else {
      x = 200 + i * widthPerUnitForProfit;
      y = 300 - profitAmount.value;
      width = widthPerUnitForProfit;
      if (i === Math.ceil(percentage.value - 1) && (percentage.value % 1) > 0) {
        width = widthPerUnitForProfit * (percentage.value % 1);
      }
      height = profitAmount.value;
    }

    return {x, y, width, height};
  });
  const capitalBG = [capitalAmount.value]
  const transitionTime = 1000;

  svg.selectAll('rect.capital-bg')
      .data(capitalBG)
      .join(
          enter => enter.append('rect')
              .classed('capital-bg', true)
              .attr('x', 0)
              .attr('y', 300 - capitalAmount.value)
              .attr('width', initialWidth)
              .attr('height', capitalAmount.value)
              .attr('fill', '#FFB3B3'),
          update => update
              .transition()
              .duration(transitionTime)
              .attr('y', 300 - capitalAmount.value)
              .attr('height', capitalAmount.value),
          exit => exit.remove()
      )

  const profitBG = [profitAmount.value]
  let profitBgX = 200;
  if (showBlocks.value) {
    profitBgX = 0;
  }
  svg.selectAll('rect.profit-bg')
      .data(profitBG)
      .join(
          enter => enter.append('rect')
              .classed('profit-bg', true)
              .attr('x', profitBgX)
              .attr('y', d => 300 - d)
              .attr('width', initialWidth)
              .attr('height', d => d)
              .attr('fill', '#bce3a9'),
          update => update
              .transition()
              .attr('x', profitBgX)
              .duration(transitionTime)
              .attr('y', d => 300 - d)
              .attr('height', d => d),
          exit => exit.remove()
      )


  svg.selectAll('rect.capital-block')
    .data(capitalBlocks)
      .join(
          enter => {
            return enter.append('rect')
                .attr('class', 'capital-block')
                .attr('x', (d: any) => d.x)
                .attr('y', (d: any) => d.y)
                .attr('width', (d: any) => d.width)
                .attr('height', (d: any) => d.height)
                .attr('fill', 'red');
          },
          update => update
              .transition()
              .duration(transitionTime)
              .attr('x', (d: any) => d.x)
              .attr('y', (d: any) => d.y)
              .attr('width', (d: any) => d.width)
              .attr('height', (d: any) => d.height),
          exit => exit.remove()
      )
  svg.selectAll('rect.profit-block')
    .data(profitBlocks)
      .join(
          enter => {
            return enter.append('rect')
                .attr('class', 'profit-block')
                .attr('x', (d: any) => d.x)
                .attr('y', (d: any) => d.y)
                .attr('width', (d: any) => d.width)
                .attr('height', (d: any) => d.height)
                .attr('fill', 'green');
          },
          update => update
              .transition()
              .duration(transitionTime)
              .attr('x', (d: any) => d.x)
              .attr('y', (d: any) => d.y)
              .attr('width', (d: any) => d.width)
              .attr('height', (d: any) => d.height),
          exit => exit.remove()
      )
};

onMounted(() => {
  if (!container.value) return;

  const svgWidth = 600;
  const svgHeight = 400;

  svg = d3
    .select(container.value)
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

  // Initial draw
  redraw();
});

// Watch for checkbox changes to show/hide blocks
watch(() => showBlocks.value, () => {
  redraw();
});

onUnmounted(() => {
  if (svg) {
    svg.selectAll('*').remove();
    svg.remove();
    svg = null;
  }
});
</script>

<style scoped>
/* No CSS grid; rendering handled by d3 */
</style>
