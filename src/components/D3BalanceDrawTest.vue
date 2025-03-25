<template>
<h2>Balance draw test using d3</h2>
  <D3BalanceDrawer :balance="balance" :width="400" :height="400" />
  <button class="btn" @click="addTransaction">Add transaction</button>
</template>

<script setup lang="ts">
import {Balance, CreditTypes, DebitTypes, InitialBalance, Transaction} from "@/balance";
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

const addTransaction = () => {
  balance.addTransaction(new Transaction(
      'Test',
      40,
      { type: DebitTypes.property},
      { type: CreditTypes.equity},
  ));
}
</script>

<style scoped>

</style>