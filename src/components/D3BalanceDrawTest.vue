<template>
<h2>Balance draw test using d3</h2>
  <D3BalanceDrawer :balance="balance" :width="width" :height="height" />
</template>

<script setup lang="ts">
import {Balance, CreditTypes, DebitTypes, InitialBalance} from "@/balance";
import D3BalanceDrawer from "@/components/D3BalanceDrawer.vue";

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

const balance = Balance.createFromInitialBalance('Barbie', initialBalance);
const width = 400;
const height = 300;

</script>

<style scoped>

</style>