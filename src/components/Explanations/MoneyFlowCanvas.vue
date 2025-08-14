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
  width: number;
  height: number;
  duration?: number;
  showMousePosition?: boolean;
  backgroundImageUrl?: string;
}>();

const duration = computed(() => props.duration ?? 1000);
const showMousePosition = computed(() => props.showMousePosition ?? false);

const canvas = ref<HTMLElement | null>(null);
let svg: d3.Selection<SVGSVGElement, unknown, null, undefined> | null = null;
let mouseMoveCleanup: (() => void) | null = null;

const renderDestinations = () => {
  if (!svg) return;

  // simple in-memory cache of image natural sizes
  const getImgSize = (() => {
    const cache = (renderDestinations as any)._imgCache as Map<string, { w: number; h: number }> || new Map();
    (renderDestinations as any)._imgCache = cache;
    return async (url: string): Promise<{ w: number; h: number }> => {
      const cached = cache.get(url);
      if (cached) return cached;
      const dims = await new Promise<{ w: number; h: number }>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ w: img.naturalWidth || img.width, h: img.naturalHeight || img.height });
        img.onerror = (e) => reject(e);
        img.src = url;
      });
      cache.set(url, dims);
      return dims;
    };
  })();

  // Ensure a container group for destinations exists
  const container = svg.select<SVGGElement>('g.destinations').empty()
    ? svg.append('g').attr('class', 'destinations')
    : svg.select<SVGGElement>('g.destinations');

  // Bind data to destination groups
  const groups = container
    .selectAll<SVGGElement, any>('g.destination')
    .data(props.destinations);

  // Exit
  groups.exit().remove();

  // Enter
  const groupsEnter = groups.enter()
    .append('g')
    .attr('class', 'destination');

  // Merge
  const groupsAll = groupsEnter.merge(groups as any);

  // For each destination group, render image > title > nothing
  groupsAll.each(function(d: any) {
    const g = d3.select(this);
    // Clear previous content
    g.selectAll('*').remove();

    const x = d.config?.position?.x ?? 0;
    const y = d.config?.position?.y ?? 0;
    const name: string = (d.name ?? '').toString();
    const showName: boolean = !!(d.config?.showName ?? true);
    const imageUrl: string | undefined = d.config?.imageUrl;
    const scale: number = Number(d.config?.scale ?? 1);

    if (imageUrl) {
      // create image element first
      const imageSel = g.append('image')
        .attr('class', 'destination-image')
        .attr('href', imageUrl)
        .attr('preserveAspectRatio', 'xMidYMid meet');

      // once we know natural size, set width/height and position so that image draws upward from the position
      getImgSize(imageUrl).then(({ w, h }) => {
        const drawW = w * scale;
        const drawH = h * scale;
        imageSel
          .attr('width', drawW)
          .attr('height', drawH)
          .attr('x', x)
          .attr('y', y - drawH);
      }).catch(() => {
        // fallback: use blockSize-derived square
        const fallback = Math.max(20, (d.config?.blockSize ?? 10) * 3) * scale;
        imageSel
          .attr('width', fallback)
          .attr('height', fallback)
          .attr('x', x)
          .attr('y', y - fallback);
      });
    } else if (showName) {
      g.append('text')
        .attr('class', 'title')
        .text(name)
        .attr('x', x)
        .attr('y', y + 30);
    } else {
      // Show nothing
    }
  });
};

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
      .attr('width', props.width)
      .attr('height', props.height)
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
    .attr('width', props.width)
    .attr('height', props.height);

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

  // render destinations (image > title > nothing)
  renderDestinations();

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

// If the destinations array identity changes, re-render their visuals (image/title)
watch(
  () => props.destinations,
  () => {
    if (!svg) return;
    renderDestinations();
  }
);


// Expose a redraw method so parent can trigger it after moving money
defineExpose({ redraw });
</script>

<style scoped>
.canvas {
  border: 0;
}
</style>
