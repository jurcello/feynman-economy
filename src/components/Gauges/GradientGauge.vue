<template>
  <Speedometer
      :minValue="min"
      :maxValue="max"
      :value="value"
      :width="200"
      :height="130"
      :ringWidth="20"
      :segments="segments"
      :maxSegmentLabels="3"
      :startColor="startColor"
      :endColor="endColor"
      :currentValueText="displayText"
      :segmentValueFormatter="segmentFormatter"
  />
</template>

<script setup lang="ts">
import Speedometer from 'vue-speedometer'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  min: number
  max: number
  value: number
  label: string
  startColor: string
  endColor: string
  unit?: string
  segments?: number
}>(), {
  unit: '',
  segments: 100,
})

const segmentFormatter = (value: number) => `${value} ${props.unit}`
const displayText = computed(() => {

  return `${props.label}: ${props.value}`
})
</script>

<style scoped>
/* Intentionally left blank */
</style>
