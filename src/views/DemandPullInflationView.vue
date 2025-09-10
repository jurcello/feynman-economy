<template>
  <div class="w-full mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-center">Demand-Pull Inflation</h1>
    <DemandPullInflation />
  </div>
</template>

<script setup lang="ts">
import DemandPullInflation from '@/components/Inflation/DemandPullInflation.vue'
// Give explicit name for clarity in Vue Devtools
defineOptions({ name: 'DemandPullInflationView' })
</script>

<style scoped>
</style>
