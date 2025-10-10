<template>
  <div class="investment-container">
    <p class="description">{{ description }}</p>
    <p class="loan">Totale lening: {{ moneyFormatter(amount)}}</p>
    <div class="gauges-container">
      <div class="gauge">
        <PercentageGauge
            :min="0"
            :okThreshold="3.5"
            :goodThreshold="6"
            :max="10"
            :value="roc"
            label="ROC"
        />
      </div>
      <div class="gauge">
        <MoneyGauge
            :min="0"
            :max="10000"
            :value="varRisk"
            label="Var"
        />
      </div>
      <div class="gauge">
        <GradientGauge
            :min="0"
            :max="100"
            :value="tonCO2"
            startColor="#00FF00"
            endColor="#ff0000"
            label="ton CO2"
            unit="tCO₂e"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import PercentageGauge from "@/components/Gauges/PercentageGauge.vue";
import MoneyGauge from "@/components/Gauges/MoneyGauge.vue";
import GradientGauge from "@/components/Gauges/GradientGauge.vue";
import {moneyFormatter} from "@/utils/display";

const props = withDefaults(defineProps<{
  amount: number
  roc: number
  varRisk: number
  tonCO2: number
  description: string
}>(), {
  amount: 20000000,
  roc: 5,
  varRisk: 7000,
  tonCO2: 50,
  description: ''
})
</script>

<style scoped>
.investment-container {
  @apply border-gray-300 border-2 p-2 inline-block max-w-fit;
}

.gauges-container {
  @apply flex flex-row gap-4 w-fit;
}

.gauge {
  @apply w-[150px] h-[100px];
}

.loan {
  @apply text-lg font-bold;
}

.description {
  @apply text-xl font-thin;
}
</style>