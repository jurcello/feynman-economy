<template>
  <div class="investment-container">
    <h2>investment</h2>
    <p>Totale lening: {{ moneyFormatter(amount)}}</p>
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
    <GradientGauge
        :min="0"
        :max="100"
        :value="50"
        startColor="#00FF00"
        endColor="#ff0000"
        label="ton CO2"
        unit="tCO₂e"
      />
  </div>
</template>

<script setup lang="ts">

import PercentageGauge from "@/components/Gauges/PercentageGauge.vue";
import MoneyGauge from "@/components/Gauges/MoneyGauge.vue";
import GradientGauge from "@/components/Gauges/GradientGauge.vue";
import {moneyFormatter} from "@/utils/display";

const amount = 20000000;

</script>

<style scoped>
.investment-container {
  @apply border-gray-300 border-2 p-2;
}
</style>