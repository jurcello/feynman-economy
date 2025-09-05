<template>
  <div class="w-2/3 mx-auto">
    <h2 class="text-2xl font-semibold mb-4">ROC</h2>
    <p class="mb-2">This is the ROC explanation/visualization component.</p>

    <!-- Slider controlling a numeric variable (0-100) -->
    <div class="mt-4">
      <label for="roc-slider" class="block text-sm font-medium text-gray-700 mb-1">
        gapwidth: {{ gapWidth }}
      </label>
      <input
        id="roc-slider"
        type="range"
        min="0"
        max="2"
        step="0.1"
        v-model.number="gapWidth"
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
const gapWidth = ref<number>(2); // default highlighted blocks

// constants for the grid
const blocks = 100;
const cols = 10;
const rows = Math.ceil(blocks / cols);
const blockSize = 10;

// Scales defined at module scope to reuse in watchers
// Use scaleBand to compute band positions and sizes; ranges are in pixels
const xScale = d3.scaleBand<number>().domain(d3.range(cols)).range([0, cols * (blockSize + gapWidth.value) - gapWidth.value]).paddingInner(0).paddingOuter(0);
const yScale = d3.scaleBand<number>().domain(d3.range(rows)).range([0, rows * (blockSize + gapWidth.value) - gapWidth.value]).paddingInner(0).paddingOuter(0);

// Type for a precomputed block
type Block = { x: number; y: number; width: number; height: number };
let blocksData: Block[] = [];

// Redraw function (restored): computes data and updates the SVG
let redraw = () => {
  if (!svg) return;
  // Precompute block objects with intrinsic x, y, width, height
  blocksData = d3.range(blocks).map((i) => {
    const c = i % cols;
    const r = Math.floor(i / cols);
    const x = xScale(c)!;
    const y = yScale(r)!;
    return { x, y, width: xScale.bandwidth(), height: yScale.bandwidth() };
  });

  (svg as any)
    .selectAll('rect.block')
    .data(blocksData)
    .join('rect')
    .attr('class', 'block')
    .attr('x', (d: any) => d.x)
    .attr('y', (d: any) => d.y)
    .attr('width', (d: any) => d.width)
    .attr('height', (d: any) => d.height)
    .attr('fill', 'red');
};

onMounted(() => {
  if (!container.value) return;

  // Update scales to current gapWidth before computing size
  xScale.range([0, cols * (blockSize + gapWidth.value) - gapWidth.value]).paddingInner(0).paddingOuter(0)
  yScale.range([0, rows * (blockSize + gapWidth.value) - gapWidth.value]).paddingInner(0).paddingOuter(0)

  const svgWidth = (xScale.range()[1])
  const svgHeight = (yScale.range()[1])

  svg = d3
    .select(container.value)
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

  // Initial draw
  redraw();
});

// Watch function (restored): react to slider changes
watch(() => gapWidth.value, () => {
  // Update scales based on new gapWidth to let scaleBand handle spacing
  xScale.range([0, cols * (blockSize + gapWidth.value) - gapWidth.value]);
  yScale.range([0, rows * (blockSize + gapWidth.value) - gapWidth.value]);
  if (svg) {
    svg.attr('width', xScale.range()[1]).attr('height', yScale.range()[1]);
  }
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
