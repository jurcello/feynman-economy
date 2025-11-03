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

    // Compute underline width from blocksPerRow and gutter
    const blockSize = Number(d.config?.blockSize ?? 10);
    const blocksPerRow = Math.max(1, Number(d.config?.blocksPerRow ?? 10));
    const blockGutter = Number(d.config?.blockGutter ?? 2);
    const underlineWidth = blocksPerRow * blockSize + (blocksPerRow - 1) * blockGutter;
    const lineY = y + 10; // draw a bit below the baseline

    // Draw the underline first so subsequent elements appear above if overlapping
    g.append('line')
      .attr('class', 'destination-underline')
      .attr('x1', x)
      .attr('y1', lineY)
      .attr('x2', x + underlineWidth)
      .attr('y2', lineY)
      .attr('stroke', '#333333')
      .attr('stroke-width', 2);

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
        const fallback = Math.max(20, blockSize * 3) * scale;
        imageSel
          .attr('width', fallback)
          .attr('height', fallback)
          .attr('x', x)
          .attr('y', y - fallback);
      });
    }

    if (showName) {
      g.append('text')
        .attr('class', 'title')
        .text(name)
        .attr('x', x)
        .attr('y', y + 30);
    }
    if (showMousePosition.value) {
      const circle = g.append('circle')
          .attr('class', 'mouse-handle')
          .attr('fill', 'transparent')
          .attr('stroke', 'black')
          .attr('stroke-width', '2')
          .attr('pointer-events', 'all')
          .attr('cx', x - 10)
          .attr('cy', y + 20)
          .attr('r', 5)
          .style('cursor', 'move');

      // Show position on hover
      circle
        .on('mouseover', function() {
          const posX = d.config?.position?.x ?? 0;
          const posY = d.config?.position?.y ?? 0;
          // remove any existing label first
          g.selectAll('text.pos-label').remove();
          g.append('text')
            .attr('class', 'pos-label')
            .attr('x', posX + 12)
            .attr('y', posY - 12)
            .attr('fill', '#222')
            .attr('font-size', 12)
            .text(`x: ${Math.round(posX)}, y: ${Math.round(posY)}`);
        })
        .on('mouseout', function() {
          g.selectAll('text.pos-label').remove();
        })
        .append('title')
        .text(() => `Drag to move. Position: x=${Math.round(x)}, y=${Math.round(y)}`);

      // Drag behavior to move entire destination by updating its config.position
      circle.call(
        d3.drag<SVGCircleElement, any>()
          .on('start', (event: any) => {
            // optional: highlight
          })
          .on('drag', (event: any) => {
            if (!svg) return;
            const [mx, my] = d3.pointer(event, svg.node() as any);
            // Convert from circle center back to destination anchor point
            const newX = mx + 10;
            const newY = my - 20;
            if (!d.config) d.config = {} as any;
            if (!d.config.position) d.config.position = { x: 0, y: 0 } as any;
            d.config.position.x = newX;
            d.config.position.y = newY;
            // Re-render destination visuals
            renderDestinations();
          })
          .on('end', () => {
            // cleanup hover label after drag end
            g.selectAll('text.pos-label').remove();
          })
      );
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
          .attr('fill', (d: any) => d.color)
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
    let currentMousePos: [number, number] | null = null;
    let lastMouseDownPos: [number, number] | null = null;

    const mousePosText = svg
        .append('text')
        .attr('class', 'mouse-position')
        .attr('x', 10)
        .attr('y', 20)
        .attr('fill', '#333333')
        .text('x: -, y: -');

    const mousemove = (event: any) => {
      currentMousePos = d3.pointer(event);
      const [x, y] = currentMousePos;
      mousePosText.text(`x: ${Math.round(x)}, y: ${Math.round(y)}`);
      const mouseDelta = lastMouseDownPos ? [x - lastMouseDownPos[0], y - lastMouseDownPos[1]] : [0, 0];
      if (lastMouseDownPos) {
        console.log('mouse delta', mouseDelta);
      }
    };
    svg.on('mousemove', mousemove);

    const mousedown = (event: any) => {
      console.log('mouse down', event);
      lastMouseDownPos = currentMousePos;
    }
    svg.on('mousedown', mousedown);

    const mouseup = (event: any) => {
      console.log('mouse up');
      lastMouseDownPos = null;
    }
    svg.on('mouseup', mouseup);


    mouseMoveCleanup = () => {
      svg?.on('mousemove', null);
      svg?.on('mousedown', null);
      svg?.on('mouseup', null);
    }
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
