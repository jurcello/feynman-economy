<template>
  <div class="investment-container">
    <h2>investment</h2>
    <PercentageGauge
        :min="0"
        :okThreshold="3.5"
        :goodThreshold="6"
        :max="10"
        :value="5"
        label="ROC"
    />
  </div>
</template>

<script setup lang="ts">

import PercentageGauge from "@/components/Gauges/PercentageGauge.vue";
</script>

<style scoped>
.investment-container {
  @apply border-gray-300 border-2 p-2;
}
</style>