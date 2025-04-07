<template>
  <h2 class="text-center">Balance draw test using d3</h2>
  <div class="flex flex-col items-center scroll-container">
    <div class="explanation-item scrolly-text-item--top"><p>
      Dit is een test om te kijken hoe scrollen kan werken met scrolltriggers.
      Voor nu komt is er nog niet veel te zien.<br>
      Start met scrollen om de animatie te beginnen.
    </p></div>
    <div class="explanation-item" id="balance">
    <D3BalanceDrawer :balance="balance" :width="400" :height="400" />
    </div>
    <div class="explanation-item scrolly-text-item" id="explain-left-and-right">
      <p>Laten we een transactie doen</p>
    </div>
    <div class="explanation-item scrolly-text-item">
      <p>Dit is de tweede text.</p>
    </div>
    <div class="explanation-item scrolly-text-item" id="explanation-end">
      <p>Dit is de derde text.</p>
    </div>

  </div>
</template>

<script setup lang="ts">
import {Balance, CreditTypes, DebitTypes, InitialBalance, Transaction} from "@/balance";
import D3BalanceDrawer from "@/components/D3BalanceDrawer.vue";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {onMounted} from "vue";

gsap.registerPlugin(ScrollTrigger);

onMounted(() => {
  gsap.to('#balance', {
    scrollTrigger: {
      trigger: '#balance',
      endTrigger: '#explanation-end',
      start: 'top-=40 top',
      end: 'bottom top',
      pin: true,
      markers: true,
    }
  });
  gsap.to('#first-transaction', {
    scrollTrigger: {
      trigger: '#first-transaction',
      start: 'top top+=400',
      end: 'bottom top',
    },
    onStart: () => {
      setTimeout(addTransaction, 1000);
    },
    opacity: 1,
    duration: 1,

  })

})
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
      { type: DebitTypes.cash},
      { type: CreditTypes.noneMoney},
  ));
}
</script>

<style scoped>
.explanation-item {
  width: 400px;
}
.scrolly-text-item {
  background-color: rgba(255, 255, 255, 0.5);
  border: 1px solid #C3C3C3;
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 300px;
  z-index: 3;
}

#explain-left-and-right {
  opacity: 0;
}
.scroll-container {
  height: 500vh;
}
</style>