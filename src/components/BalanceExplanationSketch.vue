<template>
  <div class="relative">
    <transition>
      <div v-if="currentStep == Step.STEP1">
        <p>
          Om geldschepping te kunnen begrijpen wordt in de voorbeelden vaak gewerkt met een balans.
          Je moet de balans dus begrijpen om verder te kunnen met de uitleg van geldschepping. We nemen een een persoon als voorbeeld.
          In de economie wordt voor personen geen balans gebruikt, maar je kunt het daar net zo goed gebruiken.
        </p>
        <p>
          In het begin van je leven heb je nog geen eigen geld. Pas als je wat ouder bent, krijg je voor het eerst zakgeld.
          Dit is het begin van je leven als consument. Druk op de knop om Jantje zakgeld te geven (in cash).
        </p>
        <p><button @click="addPocketMoney" class="btn" :disabled="fading">Geef € 50,- zakgeld in cash</button></p>
      </div>
    </transition>
    <transition>
      <div v-if="currentStep == Step.STEP2">
        <p>
          Je ziet dat er aan de bezittingen kant € 50,-- is bijgekomen als cash. <br />
          De linkerkant van de balans is de debetkant, ook wel activa of bezittingen genoemd.
          Deze kant laat zien wat je allemaal bezit. Nu je zakgeld gekregen hebt, heb je dus opeens € 50,- in bezit.
        </p>
        <p>Er is wel een probleem: de beide zijden van de balans zijn nu niet hetzelfde! En dat is wel de bedoeling.</p>
        <p>
          Daarom moet de rechterkant aangepast worden, maar waarmee?
        </p>
        <p>
          De rechterkant van de balans laat zien van welk vermogen het bezit afkomstig is. Dat kan eigen vermogen zijn, maar ook niet eigen vermogen.
          Niet eigen vermogen wordt ook wel vreemd vermogen genoemd, of nog beter schulden. <br />
          En een schuld is dan weer een verplichting: je moet de schuld namelijk aflossen op een gegeven moment.
        </p>
        <p>
          Om de balans weer in balans te maken, gaan we aan de rechterkant ook € 50,- toevoegen. Omdat je dit geld gekregen hebt,
          is dit dus geen schuld, maar eigen vermogen. We voegen dus eigen vermogen toe aan de rechterkant.
        </p>
        <p>
          <button @click="adjustPocketMoneyEquity" class="btn" :disabled="fading">Voeg € 50,- eigen vermogen toe</button>
        </p>
      </div>
    </transition>
    <transition>
      <div v-if="currentStep == Step.STEP3">
        <p>
          Nu we de balans weer in balans hebben, kunnen we verder met de volgende stap: we willen de nieuwste Barbie kopen.
          Die is alleen verschrikkelijk duur: € 150,-.
        </p>
        <p>
          Om de Barbie te kunnen kopen, gaan we bij een vriendje € 100,- lenen.
        </p>
        <p>
          <button @click="makeAloan" class="btn" :disabled="fading">Leen € 100,- in cash om de Barbie te kopen</button>
        </p>
      </div>
    </transition>
    <transition>
      <div v-if="currentStep == Step.STEP4">
        <p>
          We hebbenu nu €100,- in cash geleend, maar de balans is weer niet in balans :-(
        </p>
        <p>
          We hebben nu een lening afgesloten. Die moeten we dus aan de rechterkant toevoegen als schuld.
        </p>
        <p>
          <button @click="addLoanToCreditSide" class="btn" :disabled="fading">Voeg € 100,- lening toe aan de rechterkant</button>
        </p>
      </div>
    </transition>
    <transition>
      <div v-if="currentStep == Step.STEP5">
        <p>
          Nu gaan we de Barbie kopen. Dat kost €150,--
        </p>
        <p>
          <button @click="buyBarbie" class="btn" :disabled="fading">Koop de Barbie</button>
        </p>
      </div>
    </transition>
    <transition>
      <div v-if="currentStep == Step.STEP6">
        <p>
          De barbie is gekocht. Maar nu is de balans weer niet in balans, de hele linkerkant is verdwenen!
        </p>
        <p>
          Dat is niet echt verdwenen: de barbie is nog steeds in je bezit en heeft een waarde van € 150,-. Die zetten we dus bij de bezittingen aan de linkerkant van de balans.
        </p>
        <p>
          <button @click="addBarbieToProperty" class="btn" :disabled="fading">Voeg Barbie toe als bezit</button>
        </p>
      </div>
    </transition>
    <transition>
      <div v-if="currentStep == Step.STEP7">
        <p>
          De balans is nu weer ok. En het is alweer de volgende maand. Dan krijgen we weer zakgeld!
        </p>
        <p>
          <button @click="addExtraPocketMoney" class="btn" :disabled="fading">Geef extra zakgeld</button>
        </p>
      </div>
    </transition>
    <transition>
      <div v-if="currentStep == Step.STEP8">
        <p>
          Nu zijn we aan het eind van de uitleg de balans. We hebben gezien hoe de balans is opgebouwd.
        </p>
      </div>
    </transition>

  </div>
  <div class="canvas" ref="canvasContainer">
    <div v-if="!balanceIsBalanced" class="error balanceError">
      De balans is niet in balans!
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, onUnmounted, ref} from "vue";
import p5 from "p5";
import oneBalanceSketch from "../sketches/oneBalanceSketch";
import {Balance, BalanceStatus, CreditTypes, DebitTypes, Transaction} from "../balance";
import balanceDrawer from "../BalanceDrawer";

enum Step {
  STEP1,
  STEP2,
  STEP3,
  STEP4,
  STEP5,
  STEP6,
  STEP7,
  STEP8,
}

export default defineComponent({
  name: "BalanceExplanationSketch",

  setup() {
    const canvasContainer = ref<HTMLDivElement | null>(null);

    let currentStep = ref<Step>(Step.STEP1);
    let fading = ref<boolean>(false);

    let p5Instance: p5 | null = null;
    const balance = new Balance("Jantje");
    let balanceDrawerInstance: balanceDrawer | null = null;

    const setBalanceDrawerInstance = (instance: balanceDrawer) => {
      balanceDrawerInstance = instance;
    }


    const hasPocketMoneyBeenGiven = ref<boolean>(false);

    const balanceIsBalanced = ref<boolean>(true);

    const balanceStatusCallback = (balanceStatus: BalanceStatus) => {
      balanceIsBalanced.value = balanceStatus.inBalance;
    }

    balance.registerBalanceStatusCallback(balanceStatusCallback);

    const advanceToStep = (step: Step) => {
      fading.value = true;
      balanceDrawerInstance?.waitForFadeToEnd().then(() => {
        currentStep.value = step;
        fading.value = false;
      });
    }

    const addPocketMoney = () => {
      const transaction = new Transaction("First pocket money", 50, { type: DebitTypes.cash }, { type: CreditTypes.none });
      balance.addTransaction(transaction);
      advanceToStep(Step.STEP2);
    }
    const adjustPocketMoneyEquity = () => {
      const transaction = new Transaction("First pocket money equity", 50, { type: DebitTypes.none }, { type: CreditTypes.equity });
      balance.addTransaction(transaction);
      advanceToStep(Step.STEP3);
    }

    const makeAloanFor100DebetOnly = () => {
      const transaction = new Transaction("Lening", 100, { type: DebitTypes.cash }, { type: CreditTypes.none });
      balance.addTransaction(transaction);
      advanceToStep(Step.STEP4);
    }

    const addLoanToCreditSide = () => {
      const transaction = new Transaction("Lening", 100, { type: DebitTypes.none }, { type: CreditTypes.debt });
      balance.addTransaction(transaction);
      advanceToStep(Step.STEP5);
    }

    const buyBarbie = () => {
      const transaction = new Transaction("Barbie kopen", -150, { type: DebitTypes.cash }, { type: CreditTypes.none });
      balance.addTransaction(transaction);
      advanceToStep(Step.STEP6);
    }

    const addBarbieToProperty = () => {
      const transaction = new Transaction("Barbie is bezitting", 150, { type: DebitTypes.property }, { type: CreditTypes.none });
      balance.addTransaction(transaction);
      advanceToStep(Step.STEP7);
    }

    const addExtraPocketMoney = () => {
      const transaction = new Transaction("Extra pocket money", 50, { type: DebitTypes.cash }, { type: CreditTypes.equity });
      balance.addTransaction(transaction);
      advanceToStep(Step.STEP8);
    }

    onMounted(() => {
      if (canvasContainer.value) {
        const sketch = oneBalanceSketch(canvasContainer.value, balance, setBalanceDrawerInstance);
        p5Instance = new p5(sketch, canvasContainer.value); // Attach sketch to div
      }
    });

    // Lifecycle: Destroy p5 instance when component is unmounted
    onUnmounted(() => {
      if (p5Instance) {
        p5Instance.remove(); // Clean up canvas and memory
      }
    });

    return {
      canvasContainer,
      addPocketMoney,
      adjustPocketMoneyEquity,
      hasPocketMoneyBeenGiven,
      balanceIsBalanced,
      makeAloan: makeAloanFor100DebetOnly,
      currentStep,
      addLoanToCreditSide,
      buyBarbie,
      addBarbieToProperty,
      addExtraPocketMoney,
      fading,
      Step,
    };
  },
});
</script>

<style scoped>
/* Optional styling for the canvas container */
.canvas {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
}

.balanceError {
  position: absolute;
  top: 10px;
}

.v-enter-from {
  height: 0;
  opacity: 0;
  overflow: hidden;
}

.v-enter-active,
.v-leave-active {
  transition: height 0.2s ease, opacity 1s ease;
}
.v-leave-to {
  height: 0;
  opacity: 0;
}

</style>