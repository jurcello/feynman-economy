<template>
<h2>Balance draw test using d3</h2>
  <div ref="chart"></div>
</template>

<script setup lang="ts">
import {Balance, Transaction, CreditTypes, DebitTypes, InitialBalance} from "@/balance";
import {onMounted, ref} from "vue";

const initialBalance: InitialBalance = {
  debit: [
    { type: DebitTypes.currency, amount: 100 },
    { type: DebitTypes.deposits, amount: 50 },
    { type: DebitTypes.property, amount: 100 },
  ],
  credit: [
    { type: CreditTypes.equity, amount: 200 },
    { type: CreditTypes.debt, amount: 50 },
  ]
};

// Create a new balance and add some transactions to it
const balance = Balance.createFromInitialBalance('Barbie', initialBalance);

const chart = ref<HTMLElement | null>(null);


onMounted(() => {
  console.log(balance);
})
</script>

<style scoped>

</style>