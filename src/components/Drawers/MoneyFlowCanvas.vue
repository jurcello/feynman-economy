<template>
  <div ref="canvas" class="canvas"></div>
</template>

<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref, watch} from 'vue';
import type {MoneyDestination, UniverseId} from '@/utils/moneySquareUtils';
import { MoneyBlock } from '@/utils/moneySquareUtils';
import * as d3 from 'd3';
import rough from 'roughjs';
import {RoughSVG} from "roughjs/bin/svg";

const props = defineProps<{
  destinations: MoneyDestination[];
  width: number;
  height: number;
  universeId: UniverseId;
  duration?: number;
  enableDragging?: boolean;
  backgroundImageUrl?: string;
}>();

const duration = computed(() => props.duration ?? 1000);
const showMousePosition = computed(() => props.enableDragging ?? false);

const canvas = ref<HTMLElement | null>(null);
let svg: d3.Selection<SVGSVGElement, unknown, null, undefined> | null = null;
let rc: RoughSVG | null = null;

function handleMouseDragging(g: d3.Selection<SVGGElement, unknown, null, undefined>, x:number, y:number, d: any) {
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
      .on('mouseover', function () {
        const posX = d.config?.position?.x ?? 0;
        const posY = d.config?.position?.y ?? 0;
        // remove any existing label first
        g.selectAll('text.pos-label').remove();
        g.append('text')
            .attr('class', 'pos-label')
            .attr('x', posX + 6)
            .attr('y', posY - 6)
            .attr('fill', '#222')
            .attr('font-size', 12)
            .text(`x: ${Math.round(posX)}, y: ${Math.round(posY)}`);
      })
      .on('mouseout', function () {
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
            if (!d.config.position) d.config.position = {x: 0, y: 0} as any;
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
    const roughLine = rc!.line(x, lineY, x + underlineWidth, lineY, {
      stroke: '#333333',
      strokeWidth: 2,
      roughness: 1.2,
      bowing: 0.8
    });
    g.node()?.appendChild(roughLine);

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
      handleMouseDragging(g, x, y, d);
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
    .data([...MoneyBlock.getBlockArray(props.universeId)], (d: any) => d.id)
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

const redrawRough = () => {
  if (!svg || !rc) return;

  // Create a container for rough elements if it doesn't exist
  let roughContainer = svg.select('g.rough-container');
  if (roughContainer.empty()) {
    roughContainer = svg.append('g').attr('class', 'rough-container');
  }

  roughContainer
      .selectAll<SVGGElement, any>('g.money-block')
      .data([...MoneyBlock.getBlockArray(props.universeId)], (d: any) => d.id)
      .join(
          enter => {
            const enterGroups = enter
                .append('g')
                .attr('class', 'money-block')
                .attr('transform', (d: any) => `translate(${d.position.x}, ${d.position.y})`)
                .attr('opacity', 0);

            // Create rough rectangles for new blocks at origin (0,0) within the group
            enterGroups.each(function(d: any) {
              const group = d3.select(this);
              const roughRect = rc.rectangle(
                  0, // Start at 0,0 since group handles positioning
                  0,
                  d.blockSize,
                  d.blockSize,
                  {
                    fill: d.color,
                    fillStyle: 'solid',
                    stroke: d.color,
                    strokeWidth: 1,
                    roughness: 0.4,
                    bowing: 1
                  }
              );
              group.node()?.appendChild(roughRect);
            });

            return enterGroups
                .call(enter =>
                    enter
                        .transition()
                        .duration(duration.value)
                        .attr('opacity', 1)
                );
          },
          update =>
              update.call(update => {
                console.log('playing whoosh');

                return update
                    .transition()
                    .duration(duration.value)
                    .attr('transform', (d: any) => `translate(${d.position.x}, ${d.position.y})`);
              }),
          exit =>
              exit.call(exit =>
                  exit
                      .transition()
                      .duration(duration.value)
                      .attr('opacity', 0)
                      .attr('transform', (d: any) => `translate(${d.position.x - 40}, ${d.position.y + 80})`)
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
  const svgNode = svg.node();
  if (svgNode) {
    rc = rough.svg(svgNode);
  }

  // background image (if provided)
  updateBackgroundImage();
    // render destinations (image > title > nothing)
  renderDestinations();

  redraw();
});

onUnmounted(() => {
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
