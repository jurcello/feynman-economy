<template>
  <div class="sheet sheet--first">
    <h2>Geld creatie zoals uitgelegd door de bank of england</h2>
    <div class="explanation">
      <p>
        Breed geld is een maatstaf voor de totale
        hoeveelheid geld die door huishoudens en bedrijven in de economie wordt gehouden. Breed geld bestaat uit
        bankdeposito's — die in feite schuldbewijzen zijn van commerciële banken aan huishoudens en bedrijven — en
        contant geld — voornamelijk schuldbewijzen van de centrale bank. Van de twee soorten breed geld vormen
        bankdeposito's het overgrote deel — 97% van het bedrag dat momenteel in omloop is. En in de moderne
        economie worden die bankdeposito's meestal door commerciële banken zelf gecreëerd.

      </p>
      <p>
        Commerciële banken creëren geld, in de vorm van bankdeposito's, door nieuwe leningen te verstrekken. Wanneer
        een bank een lening verstrekt, bijvoorbeeld aan iemand die een hypotheek afsluit om een huis te kopen, doet ze
        dat doorgaans niet door hem duizenden euro's aan bankbiljetten te geven. In plaats daarvan crediteert ze zijn
        bankrekening met een bankdeposito ter grootte van de hypotheek. Op dat moment wordt er nieuw geld gecreëerd.
        Om deze reden hebben sommige economen bankdeposito's 'vulpen geld' genoemd, gecreëerd met een pennenstreek van
        bankiers wanneer ze leningen goedkeuren.
      </p>
      <p>Scroll naar beneden om dit in praktijk te zien.</p>
    </div>
    <div class="arrow">
      <CircleArrow />
    </div>
  </div>
  <div class="sheet bg-gray-300" id="balances-sheet">
    <h2>Laten we kijken naar de balansen</h2>
    <div class="balances">
      <div class="balance" id="central-bank-balance">
        <D3BalanceDrawer :balance="centralBank" :width="balanceWidth" :height="balanceHeight" />
      </div>
      <div class="balance" id="commercial-bank-balance">
        <D3BalanceDrawer :balance="commercialBank" :width="balanceWidth" :height="balanceHeight" />
      </div>
      <div class="balance" id="person-balance">
        <D3BalanceDrawer :balance="personBalance" :width="balanceWidth" :height="balanceHeight" />
      </div>
    </div>
  </div>
  <div class="explanation-items">
    <div class="scrolly-text-item">
      <p>
        Een commerciële bank maakt dus geld door het verstrekken van een lening.
        Omdate de meeste mensen ervan uitgaan dat alleen de centrale bank geld maakt,
        laten we eerst de balans van de centrale bank zien.
      </p>
    </div>
  </div>
  <div class="sheet last-explanation-item">
    <p>Dit was het</p>
  </div>
</template>

<script setup lang="ts">import {Balance, CreditTypes, DebitTypes} from "@/balance";
import CircleArrow from "@/components/Svg/CircleArrow.vue";
import D3BalanceDrawer from "@/components/D3BalanceDrawer.vue";
import {onMounted} from "vue";
import {gsap} from "gsap";

const initScrollytelling = () => {
  gsap.to('#balances-sheet', {
    scrollTrigger: {
      trigger: "#balances-sheet",
      endTrigger: ".last-explanation-item",
      start: 'top-=100px top',
      end: 'top bottom',
      pin: true,
      pinSpacing: false,
      markers: true,
    }
  })
}
const balanceWidth = 300;
const balanceHeight = 400;

const centralBank = Balance.createFromInitialBalance(
    "Centrale Bank", {
      debit: [
        {type: DebitTypes.noneMoney, amount: 80}
      ],
      credit: [
        {type: CreditTypes.currency, amount: 30},
        {type: CreditTypes.reserves, amount: 50},
      ]
    });

const commercialBank = Balance.createFromInitialBalance(
    "Commerciële Bank", {
      debit: [
        {type: DebitTypes.currency, amount: 25},
        {type: DebitTypes.reserves, amount: 55}
      ],
      credit: [
        {type: CreditTypes.deposits, amount: 80}
      ]
    });

const personBalance = Balance.createFromInitialBalance(
    "Persoonlijke Balans", {
      debit: [
        {type: DebitTypes.currency, amount: 30},
        {type: DebitTypes.deposits, amount: 50}
      ],
      credit: [
        {type: CreditTypes.noneMoney, amount: 80}
      ]
    });

onMounted(() => {
  initScrollytelling();
})


</script>

<style scoped>
.explanation {
  width: 50vw;
}

.scrolly-text-item {
  width: 400px;
}

.sheet--first {
  justify-content: space-around;
}

.arrow {
  align-self: center;
}

.balances {
  display: flex;
}

.balance {
  margin-left: 20px;
  &:first-child {
    margin-left: 0;
  }
}

</style>