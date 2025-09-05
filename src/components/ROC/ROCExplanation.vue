<template>
  <div class="w-2/3 mx-auto">
    <h2 class="text-2xl font-semibold mb-4">ROC</h2>
    <p class="mb-2">This is the ROC explanation/visualization component.</p>

    <div class="mt-6">
      <div ref="container" aria-label="roc-bar" role="img"></div>
      <p class="text-xs text-gray-500 mt-2">100 red blocks rendered with d3</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import * as d3 from 'd3';

const container = ref<HTMLElement | null>(null);
let svg: d3.Selection<SVGSVGElement, unknown, null, undefined> | null = null;

onMounted(() => {
  if (!container.value) return;

  const gap = 2; // gap between blocks
  const blocks = 100;
  const cols = 10; // 8 blocks wide
  const rows = Math.ceil(blocks / cols);

  // Use band scales to compute positions and block size
  const xScale = d3.scaleBand<number>()
    .domain(d3.range(cols))
    .range([0, cols])
    .paddingInner(0);

  const yScale = d3.scaleBand<number>()
    .domain(d3.range(rows))
    .range([0, rows])
    .paddingInner(0);

  // Choose a target block size and derive svg dimensions from scales and gap
  const blockSize = 10;
  const svgWidth = cols * blockSize + (cols - 1) * gap;
  const svgHeight = rows * blockSize + (rows - 1) * gap;

  svg = d3
    .select(container.value)
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

  // Convert band positions to pixel positions using the chosen blockSize and gap
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
    .attr('fill', '#ef4444'); // Tailwind red-500
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
