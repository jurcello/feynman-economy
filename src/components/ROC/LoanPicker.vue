<template>
  <div class="max-w-5xl mx-auto">
    <h2>Loanpicker</h2>
    <Investment
        :amount="loan1.amount"
        :roc="loan1.roc"
        :var-risk="loan1.varRisk"
        :ton-c-o2="loan1.tonCO2"
    />
  </div>
</template>

<script setup lang="ts">
import Investment from "@/components/ROC/SubComponents/Investment.vue";
import {reactive} from "vue";

interface LoanData {
  amount: number
  roc: number
  varRisk: number
  tonCO2: number
}

const loan1 = reactive<LoanData>({
  amount: 20000000,
  roc: 4.6,
  varRisk: 7000,
  tonCO2: 50
})
</script>

<style scoped>
</style>
