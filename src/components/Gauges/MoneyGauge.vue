<template>
  <Speedometer
      :minValue="min"
      :maxValue="max"
      :value="value"
      :width="200"
      :ringWidth="20"
      :segments="2"
      :segmentColors="colors"
      :custom-segment-stops="[min, value,max]"
      :currentValueText="`${label} € ${value}`"
      :segmentValueFormatter="segmentFormatter"
  />

</template>

<script setup lang="ts">
import Speedometer from 'vue-speedometer'
// Only define the attributes (props) as requested
const props = defineProps<{
  min: number
  max: number
  value: number
  label: string
}>()

const colors = ['#72b180', '#ffffff']


const segmentFormatter = (value: number) => `€ ${value}`
</script>

<style scoped>
/* Intentionally left blank */
</style>
