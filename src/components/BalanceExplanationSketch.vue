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
        <p><button @click="addPocketMoney" class="btn" :disabled="hasPocketMoneyBeenGiven">Geef € 50,- zakgeld in cash</button></p>
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
          <button @click="adjustPocketMoneyEquity" class="btn">Voeg € 50,- eigen vermogen toe</button>
        </p>
      </div>
    </transition>
    <transition>
      <div v-if="currentStep == Step.STEP3">
        <p>
          In het geval van je zakgeld krijg je dus € 50,- als cash wat op de linkerkant bij de bezittingen geplaatst wordt.
          Aan de rechterkant (credit) zien we wat dit betekent voor je vermogen: dit gaat ook omhoog met € 50,-.
        </p>
        <p>
          <button @click="makeAloan" class="btn">Leen € 50,- in cash om iets te kopen</button>
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
  STEP3
}

export default defineComponent({
  name: "BalanceExplanationSketch",

  setup() {
    const canvasContainer = ref<HTMLDivElement | null>(null);

    let currentStep = ref<Step>(Step.STEP1);

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

    const addPocketMoney = () => {
      const transaction = new Transaction("First pocket money", 50, { type: DebitTypes.cash }, { type: CreditTypes.none });
      balance.addTransaction(transaction);
      balanceDrawerInstance?.waitForFadeToEnd().then(() => {
        currentStep.value = Step.STEP2;
      });
    }
    const adjustPocketMoneyEquity = () => {
      const transaction = new Transaction("First pocket money equity", 50, { type: DebitTypes.none }, { type: CreditTypes.equity });
      balance.addTransaction(transaction);
    }

    const makeAloan = () => {
      const transaction = new Transaction("Lening", 50, { type: DebitTypes.cash }, { type: CreditTypes.debt });
      balance.addTransaction(transaction);
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
      makeAloan,
      currentStep,
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