<template>
  <div class="w-full mx-auto space-y-10">
    <h1 class="text-3xl font-bold mb-6 text-center">ROC</h1>
    <LoanPicker />
  </div>
</template>

<script setup lang="ts">
import ROCCalculator from "@/components/ROC/ROCCalculator.vue";
import ROCExplanation from "@/components/ROC/ROCExplanation.vue";
import LoanPicker from "@/components/ROC/LoanPicker.vue";
</script>

<style scoped>
</style>
