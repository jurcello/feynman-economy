<template>
  <div class="flex">
    <div class="px-4 border mr-4">
      <h3>Geld creatie uitgelegd door de Bank of England</h3>
      <p>
          Breed geld is een maatstaf voor de totale
          hoeveelheid geld die door huishoudens en bedrijven in de economie wordt gehouden. Breed geld bestaat uit
          bankdeposito's — die in feite schuldbewijzen zijn van commerciële banken aan huishoudens en bedrijven — en
          contant geld — voornamelijk schuldbewijzen van de centrale bank. Van de twee soorten breed geld vormen
          bankdeposito's het overgrote deel — 97% van het bedrag dat momenteel in omloop is. En in de moderne
          economie worden die bankdeposito's meestal door commerciële banken zelf gecreëerd.
        
      </p>
      <p>
        <p>
          Commerciële banken creëren geld, in de vorm van bankdeposito's, door nieuwe leningen te verstrekken. Wanneer
          een bank een lening verstrekt, bijvoorbeeld aan iemand die een hypotheek afsluit om een huis te kopen, doet ze
          dat doorgaans niet door hem duizenden euro's aan bankbiljetten te geven. In plaats daarvan crediteert ze zijn
          bankrekening met een bankdeposito ter grootte van de hypotheek. Op dat moment wordt er nieuw geld gecreëerd.
          Om deze reden hebben sommige economen bankdeposito's 'vulpen geld' genoemd, gecreëerd met een pennenstreek van
          bankiers wanneer ze leningen goedkeuren.
        </p>
        <button class="btn" @click="createLoan" v-show="!loanHasBeenCreated">
          Kijk wat er gebeurt als een bank een hypotheek verstrekt
        </button>
      </p>
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

let centralBank: BalanceDrawerExtended;
let commercialBank: BalanceDrawerExtended;
let personBalance: BalanceDrawerExtended;
const loanHasBeenCreated = ref(false);

enum Banks {
  centralBank = "Centrale bank",
  commercialBank = "Commerciele bank",
  personBalance = "Persoonlijke balans",
}

const createStartSituation = () => {
  centralBank.balance.debit[DebitTypes.noneMoney] = 80;
  centralBank.balance.credit[CreditTypes.currency] = 30;
  centralBank.balance.credit[CreditTypes.reserves] = 50;

  commercialBank.balance.debit[DebitTypes.currency] = 25;
  commercialBank.balance.debit[DebitTypes.reserves] = 55;
  commercialBank.balance.credit[CreditTypes.deposits] = 80;

  personBalance.balance.debit[DebitTypes.currency] = 30;
  personBalance.balance.debit[DebitTypes.deposits] = 50;
  personBalance.balance.credit[CreditTypes.noneMoney] = 80;
}

const createLoan = () => {
  const amount = 60;
  const bankTransaction = Transaction.create("Hypotheek", amount, DebitTypes.newLoans, CreditTypes.newDeposits);
  commercialBank.balance.addTransaction(bankTransaction);
  const personTransaction = Transaction.create("Hypotheek", amount, DebitTypes.newDeposits, CreditTypes.newLoans);
  personBalance.balance.addTransaction(personTransaction);

}

onMounted(() => {
  const width = 400;
  const height = 630;

  if (canvasContainer.value) {
    const banks = [Banks.centralBank, Banks.commercialBank, Banks.personBalance]
    const sketch = createSketch(canvasContainer.value, width, height, banks, (result) => {
      society = result.society;
      centralBank = result.society.getBalanceDrawer(Banks.centralBank);
      commercialBank = result.society.getBalanceDrawer(Banks.commercialBank);
      personBalance = result.society.getBalanceDrawer(Banks.personBalance);

      const debitCreditWiths = 150;
      centralBank.properties.positionY = 200;
      centralBank.debitCreditWiths = debitCreditWiths;
      centralBank.drawAmounts = false;
      commercialBank.properties.positionY = 400;
      commercialBank.debitCreditWiths = debitCreditWiths;
      commercialBank.drawAmounts = false;
      personBalance.properties.positionY = 600;
      personBalance.debitCreditWiths = debitCreditWiths;
      personBalance.drawAmounts = false;

      createStartSituation()
    });
    p5Instance = new p5(sketch, canvasContainer.value);
  }
})
</script>

<style scoped>

</style>