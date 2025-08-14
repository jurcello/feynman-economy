<template>
  <div ref="canvas" class="canvas"></div>
</template>

<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref, watch} from 'vue';
import type { MoneyDestination } from '@/utils/moneySquareUtils';
import { MoneyBlock } from '@/utils/moneySquareUtils';
import * as d3 from 'd3';

const props = defineProps<{
  destinations: MoneyDestination[];
  duration?: number;
  showMousePosition?: boolean;
  backgroundImageUrl?: string;
}>();

const duration = computed(() => props.duration ?? 1000);
const showMousePosition = computed(() => props.showMousePosition ?? false);

const canvas = ref<HTMLElement | null>(null);
let svg: d3.Selection<SVGSVGElement, unknown, null, undefined> | null = null;
let mouseMoveCleanup: (() => void) | null = null;

const updateBackgroundImage = () => {
  if (!svg) return;
  const imgSel = svg.select<SVGImageElement>('image.background');
  const hasUrl = !!props.backgroundImageUrl;
  if (hasUrl) {
    const img = imgSel.empty()
      ? svg.append('image').attr('class', 'background')
      : imgSel;
    img
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 800)
      .attr('height', 800)
      .attr('preserveAspectRatio', 'xMidYMid slice')
      .attr('href', props.backgroundImageUrl as string);
    // Ensure the background is behind other elements
    (img as any).lower?.();
  } else if (!imgSel.empty()) {
    imgSel.remove();
  }
};

const redraw = () => {
  if (!svg) return;
  svg
    .selectAll<SVGRectElement, any>('rect.money-block')
    .data([...MoneyBlock.allBlocks], (d: any) => d.id)
    .join(
      enter =>
        enter
          .append('rect')
          .attr('class', 'money-block')
          .attr('fill', 'red')
          .attr('x', (d: any) => d.position.x)
          .attr('y', (d: any) => d.position.y)
          .attr('width', (d: any) => d.blockSize)
          .attr('height', (d: any) => d.blockSize)
          .attr('opacity', 0)
          .call(enter =>
            enter
              .transition()
                .duration(duration.value)
                .attr('opacity', 1)
          ),
      update =>
        update.call(update => {
              console.log('playing whoosh');
              return update
                  .transition()
                  .duration(duration.value)
                  .attr('x', (d: any) => d.position.x)
                  .attr('y', (d: any) => d.position.y)
                  .attr('width', (d: any) => d.blockSize)
                  .attr('height', (d: any) => d.blockSize)
            }
        ),
      exit =>
        exit.call(exit =>
          exit
            .transition()
              .duration(duration.value)
              .attr('opacity', 0)
            .attr('x', (d: any) => d.position.x - 40)
            .attr('y', (d: any) => d.position.y + 80)
            .remove()
        )
    );
};

onMounted(() => {
  svg = d3
    .select(canvas.value)
    .append('svg')
    .attr('width', 800)
    .attr('height', 800);

  // background image (if provided)
  updateBackgroundImage();

  if (showMousePosition.value) {
    const mousePosText = svg
        .append('text')
        .attr('class', 'mouse-position')
        .attr('x', 10)
        .attr('y', 20)
        .attr('fill', '#333333')
        .text('x: -, y: -');

    const mousemove = (event: any) => {
      const [x, y] = d3.pointer(event);
      mousePosText.text(`x: ${Math.round(x)}, y: ${Math.round(y)}`);
    };
    svg.on('mousemove', mousemove);
    mouseMoveCleanup = () => svg?.on('mousemove', null);
  }

  // titles for destinations
  svg
    .append('g')
    .selectAll('text.title')
    .data(props.destinations)
    .join('text')
    .attr('class', 'title')
    .text((d: any) => d.name)
    .attr('x', (d: any) => d.config.position.x)
    .attr('y', (d: any) => d.config.position.y + 30);

  redraw();
});

onUnmounted(() => {
  mouseMoveCleanup?.();
  if (svg) {
    svg.selectAll('*').remove();
    svg.remove();
    svg = null;
  }
});

// If the destinations array identity changes (unlikely in this scenario), redraw titles
watch(
  () => props.destinations,
  (newVal, oldVal) => {
    if (!svg) return;
    svg
      .selectAll('g .title')
      .data(newVal)
      .join(
        enter =>
          enter
            .append('text')
            .attr('class', 'title')
            .text((d: any) => d.name)
            .attr('x', (d: any) => d.config.position.x)
            .attr('y', (d: any) => d.config.position.y + 30),
        update =>
          update
            .text((d: any) => d.name)
            .attr('x', (d: any) => d.config.position.x)
            .attr('y', (d: any) => d.config.position.y + 30),
        exit => exit.remove()
      );
  }
);


// Expose a redraw method so parent can trigger it after moving money
defineExpose({ redraw });
</script>

<style scoped>
.canvas {
  border: 1px solid #ccc;
}
</style>
