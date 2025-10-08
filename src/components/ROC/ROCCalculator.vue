<template>
  <div class="max-w-4xl mx-auto">
    <h2 class="text-2xl font-semibold mb-4">ROC Calculator</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-5">
        <!-- Profit Slider -->
        <div>
          <label for="profit" class="block text-sm font-medium text-gray-700 mb-1">
            Profit: {{ formatCurrency(roc.profit) }}
          </label>
          <input
            id="profit"
            type="range"
            min="0"
            max="500"
            step="1"
            v-model.number="roc.profit"
            class="w-full"
            aria-label="profit-slider"
          />
        </div>

        <!-- Equity Slider -->
        <div>
          <label for="equity" class="block text-sm font-medium text-gray-700 mb-1">
            Equity: {{ formatCurrency(roc.equity) }}
          </label>
          <input
            id="equity"
            type="range"
            min="0"
            max="2000"
            step="10"
            v-model.number="roc.equity"
            class="w-full"
            aria-label="equity-slider"
          />
        </div>

        <!-- Debt Slider -->
        <div>
          <label for="debt" class="block text-sm font-medium text-gray-700 mb-1">
            Debt: {{ formatCurrency(roc.debt) }}
          </label>
          <input
            id="debt"
            type="range"
            min="0"
            max="2000"
            step="10"
            v-model.number="roc.debt"
            class="w-full"
            aria-label="debt-slider"
          />
        </div>

        <!-- Cost of Debt Slider -->
        <div>
          <label for="costOfDebt" class="block text-sm font-medium text-gray-700 mb-1">
            Cost of Debt: {{ formatPercent(roc.costOfDebt) }}
          </label>
          <input
            id="costOfDebt"
            type="range"
            min="0"
            max="0.3"
            step="0.001"
            v-model.number="roc.costOfDebt"
            class="w-full"
            aria-label="cost-of-debt-slider"
          />
        </div>
      </div>

      <div class="bg-white/50 rounded-lg p-4 border">
        <h3 class="text-lg font-semibold mb-3">Derived metrics</h3>
        <ul class="space-y-1">
          <li>
            <span class="font-medium">Invested Capital:</span>
            <span>{{ formatCurrency(roc.investedCapital) }}</span>
          </li>
          <li>
            <span class="font-medium">Interest Expense:</span>
            <span>{{ formatCurrency(roc.interestExpense) }}</span>
          </li>
          <li>
            <span class="font-medium">ROC (Return on Capital):</span>
            <span>{{ formatPercent(roc.roc) }}</span>
          </li>
          <li>
            <span class="font-medium">VaR (95%):</span>
            <span>{{ formatCurrency(roc.var95) }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {CarbonCredit, createROC, ResourceCredit} from '@/PlainObjects/ROC/rocCalculation';

const roc = createROC({ profit: 50, equity: 800, debt: 400, costOfDebt: 0.05 });
const ccCredits = [
    new CarbonCredit({
      amount: 1,
      unitOfMeasurement: 'ton CO2',
      cost: 10,
    }),
    new CarbonCredit({
      amount: 1,
      unitOfMeasurement: 'ton CO2',
      cost: 10,
    }),
]

roc.carbonCredits = ccCredits;

function formatCurrency(v: number): string {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v);
}

function formatPercent(v: number): string {
  return (v * 100).toFixed(2) + '%';
}
</script>

<style scoped>
</style>
