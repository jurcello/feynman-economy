<template>
  <Speedometer
      :minValue="min"
      :maxValue="max"
      :value="value"
      :width="200"
      :ringWidth="20"
      :segments="3"
      :segmentColors="colors"
      :custom-segment-stops="[min, okThreshold, goodThreshold,max]"
      :currentValueText="`${label} ${value}%`"
      :segmentValueFormatter="segmentFormatter"
  />
</template>

<script setup lang="ts">
import Speedometer from 'vue-speedometer'
// Only define the attributes (props) as requested
const props = withDefaults(defineProps<{
  min: number
  max: number
  okThreshold?: number
  goodThreshold?: number
  value: number
  label: string
}>(), {
  okThreshold: 5,
  goodThreshold: 7,
})

const colors = ['#DC3545', '#FFC107', '#28A745']

const segmentFormatter = (value: number) => `${value}%`
// No additional logic or rendering at this stage
</script>

<style scoped>
/* Intentionally left blank */
</style>
