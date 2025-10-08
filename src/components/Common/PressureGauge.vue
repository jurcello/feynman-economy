<template>
  <div class="flex flex-col items-center select-none" :aria-label="`${label || 'gauge'}`" role="img">
    <svg :width="size" :height="size/2" :viewBox="`0 0 ${size} ${size/2}`">
      <!-- Background arc -->
      <path :d="arcPath(0, 180)" fill="none" :stroke="trackColor" :stroke-width="strokeWidth" stroke-linecap="round" />
      <!-- Value arc -->
      <path :d="arcPath(0, angle)" fill="none" :stroke="currentColorHex" :stroke-width="strokeWidth" stroke-linecap="round" :style="{ color: currentColorHex }" />
      <!-- Ticks -->
      <g v-if="showTicks">
        <template v-for="t in tickAngles" :key="t">
          <line :x1="polarToX(center, radius, t)" :y1="polarToY(center, radius, t)"
                :x2="polarToX(center, radius - tickLength, t)" :y2="polarToY(center, radius - tickLength, t)"
                :stroke="tickColor" :stroke-width="1" />
        </template>
      </g>
      <!-- Needle -->
      <g :transform="`translate(${center.x}, ${center.y}) rotate(${angle - 180})`" class="transition-transform duration-300 ease-out">
        <line x1="0" y1="0" :x2="radius - strokeWidth" y2="0" :stroke="needleColor" :stroke-width="2" stroke-linecap="round" />
        <circle r="4" :fill="needleColor" />
      </g>
    </svg>
    <div class="text-center mt-2">
      <div v-if="label" class="text-xs text-gray-600">{{ label }}</div>
      <div class="font-semibold">{{ formattedValue }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  okColor?: string;
  badColor?: string;
  threshold: number; // threshold where color becomes fully bad
  value: number;     // current value
  label?: string;
  size?: number;     // px width of gauge
  strokeWidth?: number; // arc stroke width
  showTicks?: boolean;
  format?: (v: number) => string; // custom value formatting
  trackColor?: string;
  tickColor?: string;
  needleColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  okColor: '#16a34a', // tailwind green-600
  badColor: '#dc2626', // tailwind red-600
  threshold: 100,
  value: 0,
  label: '',
  size: 220,
  strokeWidth: 10,
  showTicks: true,
  trackColor: '#e5e7eb', // gray-200
  tickColor: '#9ca3af', // gray-400
  needleColor: '#111827', // gray-900
});

const pct = computed(() => {
  if (!isFinite(props.threshold) || props.threshold === 0) return 0;
  return Math.max(0, props.value / props.threshold);
});

const clamped = computed(() => Math.min(1, pct.value));
const angle = computed(() => 180 * clamped.value); // 0..180 degrees

const currentColorHex = computed(() => lerpColor(props.okColor, props.badColor, clamped.value));

const formattedValue = computed(() => (props.format ? props.format(props.value) : String(props.value)));

// Geometry helpers
const radius = computed(() => (props.size / 2) - props.strokeWidth);
const center = computed(() => ({ x: props.size / 2, y: props.size / 2 }));
const tickCount = 9; // 0..180 every 20 deg
const tickLength = 6;
const tickAngles = computed(() => Array.from({ length: tickCount + 1 }, (_, i) => 180 * (i / tickCount)));

function toRad(deg: number) { return (deg - 180) * Math.PI / 180; }
function polarToX(c: {x:number, y:number}, r: number, deg: number) { return c.x + r * Math.cos(toRad(deg)); }
function polarToY(c: {x:number, y:number}, r: number, deg: number) { return c.y + r * Math.sin(toRad(deg)); }

function arcPath(startDeg: number, endDeg: number) {
  const r = radius.value;
  const c = center.value;
  const largeArcFlag = endDeg - startDeg <= 180 ? 0 : 1;
  const start = {
    x: polarToX(c, r, startDeg),
    y: polarToY(c, r, startDeg),
  };
  const end = {
    x: polarToX(c, r, endDeg),
    y: polarToY(c, r, endDeg),
  };
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

// Color interpolation
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function parseColor(input: string): [number, number, number] {
  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return [0, 0, 0];
  ctx.fillStyle = input;
  const computed = ctx.fillStyle as string;
  // computed is in rgb(a) format
  const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(computed);
  if (!m) return [0, 0, 0];
  return [parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10)];
}

function toHex(n: number) { const v = Math.max(0, Math.min(255, Math.round(n))); return v.toString(16).padStart(2, '0'); }
function rgbToHex(rgb: [number, number, number]) { return `#${toHex(rgb[0])}${toHex(rgb[1])}${toHex(rgb[2])}`; }
function lerpColor(a: string, b: string, t: number) {
  const ca = parseColor(a);
  const cb = parseColor(b);
  const r: [number, number, number] = [
    lerp(ca[0], cb[0], t),
    lerp(ca[1], cb[1], t),
    lerp(ca[2], cb[2], t),
  ] as unknown as [number, number, number];
  return rgbToHex(r);
}
</script>

<style scoped>
</style>
