<template>
  <p>Hi all

  </p>
  <p><button @click="depositToBank1" class="btn">Stort geld op de {{ Banks.bank1 }}</button></p>
  <p><button @click="moveMoneyToBank2" class="btn">Transfer naar de {{ Banks.bank2 }}</button></p>
  <p><button @click="moveMoneyToBank3from2" class="btn">Transfer € 180 van de {{ Banks.bank2 }} naar de {{ Banks.bank3}}</button></p>
  <p><button @click="moveMoneyToBank4from3" class="btn">Transfer € 170 van de {{ Banks.bank3 }} naar de {{ Banks.bank4}}</button></p>
  <p>
    De totale geldhoeveelheid:
    <ul>
      <li>Totaal: {{ totalMoney.toLocaleString('nl-NL', {style: 'currency', currency: 'EUR'}) }}</li>
      <li>Cash: {{ totalCash.toLocaleString('nl-NL', {style: 'currency', currency: 'EUR'}) }}</li>
      <li>Percentagec cash: {{ percentageCash.toFixed(1) }} %</li>
    </ul>
  </p>
  <div class="canvas" ref="canvasContainer">
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";
import p5 from "p5";
import moneyMultiplier from "@/sketches/moneyMultiplier";
import Money from "@/sketches/Animatables/Money";
import Society from "@/sketches/Animatables/Society";
import BalanceDrawerExtended from "@/sketches/Animatables/BalanceDrawerExtended";
import {CreditTypes, DebitTypes, Transaction} from "@/balance";

enum Banks {
  bank1 = "Rabobank",
  bank2 = "Asn bank",
  bank3 = "Triodos bank",
  bank4 = "ING bank",
}

const canvasContainer = ref<HTMLDivElement | null>(null);
let p5Instance: p5 | null = null;

let money: Money;
let society: Society;
let bank1: BalanceDrawerExtended;
let bank2: BalanceDrawerExtended;
let bank3: BalanceDrawerExtended;
let bank4: BalanceDrawerExtended;
let totalMoney = ref<number>(0);
let totalCash = ref<number>(0);
let percentageCash = ref<number>(0);

const updateTotals = () => {
  const totals = society.getMoneyAggregates();
  totalMoney.value = totals.total;
  totalCash.value = totals.cash;
  percentageCash.value = totals.cash / totals.total * 100;
};

onMounted(() => {
  if (canvasContainer.value) {
    const sketch = moneyMultiplier(canvasContainer.value, [Banks.bank1, Banks.bank2, Banks.bank3, Banks.bank4], (result) => {
      money = result.money;
      society = result.society;

      bank1 = society.getBalanceDrawer(Banks.bank1);
      bank2 = society.getBalanceDrawer(Banks.bank2);
      bank3 = society.getBalanceDrawer(Banks.bank3);
      bank4 = society.getBalanceDrawer(Banks.bank4);
      bank1.properties.positionY = 480;
      bank2.properties.positionY = 480;
      bank3.properties.positionY = 480;
      bank4.properties.positionY = 480;
      bank2.properties.positionX = 300;
      bank3.properties.positionX = 550;
      bank4.properties.positionX = 800;
    });
    p5Instance = new p5(sketch, canvasContainer.value);
  }
});

// Lifecycle: Destroy p5 instance when component is unmounted
onUnmounted(() => {
  if (p5Instance) {
    p5Instance.remove(); // Clean up canvas and memory
  }
});

const depositToBank1 = () => {
  money.moveFromTo(
    {
      x: 550,
      y: 10
    },
    {
      x: bank1.getPosition().x,
      y: bank1.getPosition().y,
    }).then(() => {
      const transaction = new Transaction("storting", 200, { type: DebitTypes.cash }, { type: CreditTypes.savingsAccount});
      bank1.balance.addTransaction(transaction);
      return bank1.waitForFadeToEnd();
  }).then(updateTotals)
}

const moveMoneyToBank2 = () => {
  let amount = 190;
  const transaction1 = new Transaction("Lening", - amount, { type: DebitTypes.cash }, { type: CreditTypes.none});
  const transaction2 = new Transaction("Lening", amount, { type: DebitTypes.loan }, { type: CreditTypes.none});
  const transaction3 = new Transaction("storting", amount, { type: DebitTypes.cash }, { type: CreditTypes.savingsAccount});

  bank1.balance.addTransaction(transaction1);
  bank1.waitForFadeToEnd().then(() => {
    bank1.balance.addTransaction(transaction2);
    return bank1.waitForFadeToEnd();
  }).then(() => {
    money.moveFromTo(bank1.getPosition(), bank2.getPosition()).then(() => {
      bank2.balance.addTransaction(transaction3);
      return bank2.waitForFadeToEnd();
    }).then(updateTotals);
  })
}

const moveMoneyToBank3from2 = () => {
  let amount = 180;
  const transaction1 = new Transaction("Lening", - amount, { type: DebitTypes.cash }, { type: CreditTypes.none});
  const transaction2 = new Transaction("Lening", amount, { type: DebitTypes.loan }, { type: CreditTypes.none});
  const transaction3 = new Transaction("storting", amount, { type: DebitTypes.cash }, { type: CreditTypes.savingsAccount});

  bank2.balance.addTransaction(transaction1);
  bank2.waitForFadeToEnd().then(() => {
    bank2.balance.addTransaction(transaction2);
    return bank2.waitForFadeToEnd();
  }).then(() => {
    money.moveFromTo(bank2.getPosition(), bank3.getPosition()).then(() => {
      bank3.balance.addTransaction(transaction3);
      return bank3.waitForFadeToEnd();
    }).then(updateTotals);
  })
}

const moveMoneyToBank4from3 = () => {
  let amount = 170;
  const transaction1 = new Transaction("Lening", - amount, { type: DebitTypes.cash }, { type: CreditTypes.none});
  const transaction2 = new Transaction("Lening", amount, { type: DebitTypes.loan }, { type: CreditTypes.none});
  const transaction3 = new Transaction("storting", amount, { type: DebitTypes.cash }, { type: CreditTypes.savingsAccount});

  bank3.balance.addTransaction(transaction1);
  bank3.waitForFadeToEnd().then(() => {
    bank3.balance.addTransaction(transaction2);
    return bank3.waitForFadeToEnd();
  }).then(() => {
    money.moveFromTo(bank3.getPosition(), bank4.getPosition()).then(() => {
      bank4.balance.addTransaction(transaction3);
      return bank4.waitForFadeToEnd();
    }).then(updateTotals);
  })
}

</script>

<style scoped>
.canvas {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>