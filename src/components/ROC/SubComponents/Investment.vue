<template>
  <div class="investment-container">
    <h2>investment</h2>
    <p>Totale lening: € 20.000.000,0</p>
    <PercentageGauge
        :min="0"
        :okThreshold="3.5"
        :goodThreshold="6"
        :max="10"
        :value="5"
        label="ROC"
    />
    <MoneyGauge
        :min="0"
        :max="10000"
        :value="7000"
        label="Var"
      />
  </div>
</template>

<script setup lang="ts">

import PercentageGauge from "@/components/Gauges/PercentageGauge.vue";
import MoneyGauge from "@/components/Gauges/MoneyGauge.vue";
</script>

<style scoped>
.investment-container {
  @apply border-gray-300 border-2 p-2;
}
</style>