<template>
  <Speedometer
      :minValue="min"
      :maxValue="max"
      :value="value"
      :fluidWidth="true"
      :ringWidth="20"
      :segments="2"
      :segmentColors="colors"
      :custom-segment-stops="[min, value,max]"
      :currentValueText="`${label}: ${moneyFormatter(value)}`"
      :segmentValueFormatter="moneyFormatter"
  />

</template>

<script setup lang="ts">
import Speedometer from 'vue-speedometer'
import {moneyFormatter} from "@/utils/display";
// Only define the attributes (props) as requested
const props = defineProps<{
  min: number
  max: number
  value: number
  label: string
}>()

const colors = ['#72b180', '#e1e1e1']


</script>

<style scoped>
/* Intentionally left blank */
</style>
