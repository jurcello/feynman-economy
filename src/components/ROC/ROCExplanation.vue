<template>
  <div class="w-2/3 mx-auto">
    <h2 class="text-2xl font-semibold mb-4">ROC</h2>
    <p class="mb-2">This is the ROC explanation/visualization component.</p>

    <!-- Slider controlling a numeric variable (0-100) -->
    <div class="mt-4">
      <label for="roc-slider" class="block text-sm font-medium text-gray-700 mb-1">
        gapwidth: {{ value }}
      </label>
      <input
        id="roc-slider"
        type="range"
        min="0"
        max="2"
        step="0.1"
        v-model.number="value"
        class="w-full"
        aria-label="roc-slider"
      />
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

// Slider-controlled numeric variable
const value = ref<number>(25); // default highlighted blocks

// constants for the grid
const gap = 2; // gap between blocks
const blocks = 100;
const cols = 10;
const rows = Math.ceil(blocks / cols);
const blockSize = 10;

// Scales defined at module scope to reuse in watchers
const xScale = d3.scaleBand<number>().domain(d3.range(cols)).range([0, cols]).paddingInner(0);
const yScale = d3.scaleBand<number>().domain(d3.range(rows)).range([0, rows]).paddingInner(0);

onMounted(() => {
  if (!container.value) return;

  const svgWidth = cols * blockSize + (cols - 1) * gap;
  const svgHeight = rows * blockSize + (rows - 1) * gap;

  svg = d3
    .select(container.value)
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

  const xPos = (c: number) => (xScale(c)! * blockSize) + c * gap;
  const yPos = (r: number) => (yScale(r)! * blockSize) + r * gap;

  const data = d3.range(blocks);

  (svg as any)
    .selectAll('rect.block')
    .data(data)
    .join('rect')
    .attr('class', 'block')
    .attr('x', (d: number) => xPos(d % cols))
    .attr('y', (d: number) => yPos(Math.floor(d / cols)))
    .attr('width', blockSize)
    .attr('height', blockSize)
    .attr('fill', '#9ca3af'); // neutral gray-400
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
