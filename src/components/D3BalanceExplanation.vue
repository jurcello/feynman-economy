<template>
  <div class="first-page sheet">
    <h1 class="text-center uppercase">De balans</h1>
    <div class="explanation-item">
      <p>
        Om geldschepping te kunnen begrijpen wordt in de voorbeelden vaak gewerkt met een balans.
        Je moet de balans dus begrijpen om verder te kunnen met de uitleg van geldschepping.
      </p>
      <p>
        We nemen een een persoon als voorbeeld.
        In de economie wordt voor personen geen balans gebruikt, maar je kunt het daar net zo goed gebruiken.
      </p>
    </div>
    <div class="explanation-item arrow" id="arrow-animate">
      <CircleArrow :size="120" />
    </div>
  </div>
  <div class="sheet bg-cyan-200" id="balance">
    <div class="explanation-item">
      <p>Hieronder zie je de balans. Je ziet op dit moment alleen maar de beschrijvingen van de balans:</p>
    </div>
    <div>
      <D3BalanceDrawer :balance="balance" :width="400" :height="400" :maxY="200" :debit-description="debitDescription"/>
    </div>
  </div>
  <div class="explanation-items">
    <div class="text-item last-explanation" id="scroll-text">
      Eigenlijk heten de kanten anders...
    </div>
  </div>
  <div class="sheet bg-yellow-200 z-10" id="last">
    <div><p>Hi</p></div>
  </div>

</template>

<script setup lang="ts">
import {Balance, CreditTypes, DebitTypes, InitialBalance, Transaction} from "@/balance";
import D3BalanceDrawer from "@/components/D3BalanceDrawer.vue";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {onMounted, defineProps, ref} from "vue";
import CircleArrow from "@/components/Svg/CircleArrow.vue";

const debitDescription = ref<string>('Bezittingen');

gsap.registerPlugin(ScrollTrigger);

onMounted(() => {
  gsap.to('#balance', {
    scrollTrigger: {
      trigger: '#balance',
      endTrigger: '#last',
      start: 'top-=100px top',
      end: 'top bottom',
      pin: true,
      pinSpacing: false,
      markers: false,
    },
    opacity: 1,
    duration: 1,
  });
  gsap.to('#scroll-text', {
    opacity: 1,
    y: 0,
    scrollTrigger: {
      trigger: '#scroll-text',
      start: 'top center',
      markers: true,
      onEnter: () => {
        debitDescription.value = 'Bezittingenssss';
      }
    }
  });

  gsap.to('#arrow-animate', {
    transform: "translateY(25px)",
    repeat: -1,
    duration: 1,
    yoyo: true,
    ease: "sine",
  });

})


const balance = new Balance('Eerste balans');

// Define props with the correct type structure
defineProps({
  width: {
    type: Number,
    default: 400
  },
  height: {
    type: Number,
    default: 400
  },
  maxY: {
    type: Number,
    default: 200
  }
});

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

.sheet {
  height: calc(100dvh - 100px);
  @apply w-full flex flex-col items-center;
}

.first-page {
  @apply flex flex-col justify-around;
}
.arrow {
  @apply flex justify-center;
}

.explanation-items {
  @apply flex flex-col items-center;
}

.text-item {
  background-color: rgba(255, 255, 255, 0.5);
  border: 1px solid #C3C3C3;
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 300px;
  z-index: 3;
  width: 400px;
}

.last-explanation {
  margin-bottom: calc(100vh);
}
</style>