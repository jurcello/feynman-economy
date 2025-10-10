<template>
  <Speedometer
      :minValue="min"
      :maxValue="max"
      :value="value"
      :fluidWidth="true"
      :ringWidth="20"
      :segments="2"
      :segmentColors="segmentColors"
      :custom-segment-stops="[min, maxAllowed, max]"
      :currentValueText="displayText"
  />
</template>

<script setup lang="ts">
import Speedometer from 'vue-speedometer'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  min?: number
  max: number
  maxAllowed: number
  value: number
  label: string
  unit?: string
}>(), {
  min: 0,
  unit: '',
})

const segmentColors = ['#28A745', '#DC3545'] // green, red

const displayText = computed(() => {
  const unitSuffix = props.unit ? ` ${props.unit}` : ''
  return `${props.value}${unitSuffix}`
})
</script>

<style scoped>
/* Intentionally left blank */
</style>
