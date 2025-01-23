<template>
  <div class="flex flex-col">
    <div class="px-4 border mr-4">
      <h3>Geld creatie uitgelegd door de Bank of England (2/3)</h3>

    </div>
    <div class="canvas my-4" ref="canvasContainer">
    </div>
  </div>
</template>

<script setup lang="ts">
import createSketch from "@/sketches/moneyCreationBOE";
import {onMounted, ref} from "vue";
import Society from "@/sketches/Animatables/Society";
import p5 from "p5";
import BalanceDrawerExtended from "@/sketches/Animatables/BalanceDrawerExtended";
import {CreditTypes, DebitTypes, Transaction} from "@/balance";

const canvasContainer = ref<HTMLDivElement | null>(null);
let society: Society;
let p5Instance: p5 | null = null;

let houseBuyer: BalanceDrawerExtended;
let houseSeller: BalanceDrawerExtended;
let buyersBank: BalanceDrawerExtended;
let sellersBank: BalanceDrawerExtended;

enum Balances {
  houseBuyer = "Huis koper",
  houseSeller = "Huis verkoper",
  buyersBank = "Bank van koper",
  sellersBank = "Bank van verkoper",
}

const createStartSituation = () => {
  houseBuyer.balance.debit[DebitTypes.noneMoney] = 80;
  houseBuyer.balance.credit[CreditTypes.currency] = 30;
  houseBuyer.balance.credit[CreditTypes.reserves] = 50;

  houseSeller.balance.debit[DebitTypes.currency] = 25;
  houseSeller.balance.debit[DebitTypes.reserves] = 55;
  houseSeller.balance.credit[CreditTypes.deposits] = 80;

  buyersBank.balance.debit[DebitTypes.currency] = 30;
  buyersBank.balance.debit[DebitTypes.deposits] = 50;
  buyersBank.balance.credit[CreditTypes.noneMoney] = 80;
}

onMounted(() => {
  const width = 800;
  const height = 550;

  if (canvasContainer.value) {
    const banks = [Balances.houseBuyer, Balances.houseSeller, Balances.buyersBank, Balances.sellersBank]
    const sketch = createSketch(canvasContainer.value, width, height, banks, (result) => {
      society = result.society;
      houseBuyer = result.society.getBalanceDrawer(Balances.houseBuyer);
      houseSeller = result.society.getBalanceDrawer(Balances.houseSeller);
      buyersBank = result.society.getBalanceDrawer(Balances.buyersBank);
      sellersBank = result.society.getBalanceDrawer(Balances.sellersBank);

      const debitCreditWiths = 150;
      houseBuyer.properties.positionY = 200;
      houseBuyer.debitCreditWiths = debitCreditWiths;
      houseBuyer.drawAmounts = false;
      houseSeller.properties.positionY = 400;
      houseSeller.debitCreditWiths = debitCreditWiths;
      houseSeller.drawAmounts = false;
      buyersBank.properties.positionY = 600;
      buyersBank.debitCreditWiths = debitCreditWiths;
      buyersBank.drawAmounts = false;

      createStartSituation()
    });
    p5Instance = new p5(sketch, canvasContainer.value);
  }
})
</script>

<style scoped>

</style>