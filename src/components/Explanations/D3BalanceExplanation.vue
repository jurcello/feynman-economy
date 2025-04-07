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
  <div class="sheet bg-gray-200" id="balance">
    <div class="explanation-item py-8">
      <p>Hieronder zie je de balans. Je ziet op dit moment alleen maar de beschrijvingen van de balans:</p>
      <ul>
        <li>Links: Wat heb je?</li>
        <li>Rechts: Waar komt dit geld vandaan</li>
      </ul>
      <p>Dit is de balans als je net geboren wordt. Er staat nu nog niets op, dus je ziet alleen de beschrijvingen.</p>
    </div>
    <div>
      <D3BalanceDrawer :balance="balance" :width="500" :height="400" :maxY="200"
          :debit-description="debitDescription"
          :credit-description="creditDescription"
      />
    </div>
  </div>
  <div class="explanation-items">
    <div class="scrolly-text-item" id="add-pocket-money">
      <p>Nu krijg je je eerste zakgeld. Je ouders geven meteen veel: € 50,00.</p>
      <p>Je hebt dus nu € 50,00 in cash geld! Dit wordt aan de linker kant van de balans gezet</p>
    </div>
    <div class="scrolly-text-item" id="fix-pocket-money">
      <p>Er is wel een probleem: de beide zijden van de balans zijn nu niet hetzelfde! En dat is wel de bedoeling.</p>
      <p>
        Daarom moet de rechterkant aangepast worden, maar waarmee? Waar komt het geld vandaan?
      </p>
      <p>
        We zeggen dat als je het geld gekregen of verdient hebt, dat dit van je eigen vermogen komt.
        Laten we dat dan ook aan de rechterkant zetten.
      </p>
    </div>
    <div class="scrolly-text-item" id="make-loan-for-barbie">
      <p>
        Nu we de balans weer in balans hebben, kunnen we verder met de volgende stap: we willen de nieuwste Barbie kopen.
        Die is alleen verschrikkelijk duur: € 150,-.
      </p>
      <p>
        Om de Barbie te kunnen kopen, gaan we bij een vriendje € 100,- lenen.
      </p>
    </div>
    <div class="scrolly-text-item" id="credit-for-loan">
      <p>
        We hebben nu €100,- in cash geleend, maar de balans is weer niet in balans :-(
      </p>
      <p>
        Waar komt het geld vandaan?
        <br/>
        We hebben nu een lening afgesloten. Die moeten we dus aan de rechterkant toevoegen als schuld.
      </p>
    </div>
    <div class="scrolly-text-item" id="buy-barbie">
      <p>
        Nu gaan we de Barbie kopen. Dat kost €150,--
      </p>
    </div>
    <div class="scrolly-text-item" id="add-barbie-to-property">
      <p>
        De barbie is gekocht. Maar nu is de balans weer niet in balans, de hele linkerkant is verdwenen!
      </p>
      <p>
        Dat is niet echt verdwenen: de barbie is nog steeds in je bezit en heeft een waarde van € 150,-. Die zetten we dus bij de bezittingen aan de linkerkant van de balans.
      </p>
    </div>
    <div class="scrolly-text-item" id="add-extra-pocket-money">
      <p>
        De balans is nu weer ok. En het is alweer de volgende maand. Dan krijgen we weer zakgeld!
      </p>
    </div>
    <div class="scrolly-text-item" id="last-explanation">
      <p>Eigenlijk heten de kanten anders: De linkerkant wordt vaak Debet of bezittingen genoemd.</p>
      <p>De rechterkant heet dan Credit / verplichtingen.</p>
      <p>Laten we dit aanpassen.</p>
    </div>
  </div>
  <div class="sheet bg-yellow-200 z-10" id="last">
    <div><p>
      Nu zijn we aan het eind van de uitleg de balans. We hebben gezien hoe de balans is opgebouwd.
    </p>
      <p>Hier volgt een uiteindelijke uitleg van de balans.</p></div>
  </div>

</template>

<script setup lang="ts">
import {Balance, CreditTypes, DebitTypes, InitialBalance, Transaction} from "@/balance";
import D3BalanceDrawer from "@/components/D3BalanceDrawer.vue";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {onMounted, defineProps, ref} from "vue";
import CircleArrow from "@/components/Svg/CircleArrow.vue";

const debitDescription = ref<string|null>('Wat heb je');
const creditDescription = ref<string|null>('Waar komt het geld vandaan');

const balance = new Balance('Jouw persoonlijke balans');

const addPocketMoney = () => {
  const transaction = new Transaction("First pocket money", 50, { type: DebitTypes.cash }, { type: CreditTypes.none });
  balance.addTransaction(transaction);
}

const adjustPocketMoneyEquity = () => {
  const transaction = new Transaction("First pocket money equity", 50, { type: DebitTypes.none }, { type: CreditTypes.equity });
  balance.addTransaction(transaction);
}

const makeAloanFor100DebetOnly = () => {
  const transaction = new Transaction("Lening", 100, { type: DebitTypes.cash }, { type: CreditTypes.none });
  balance.addTransaction(transaction);
}

const addLoanToCreditSide = () => {
  const transaction = new Transaction("Lening", 100, { type: DebitTypes.none }, { type: CreditTypes.debt });
  balance.addTransaction(transaction);
}

const buyBarbie = () => {
  const transaction = new Transaction("Barbie kopen", -150, { type: DebitTypes.cash }, { type: CreditTypes.none });
  balance.addTransaction(transaction);
}

const addBarbieToProperty = () => {
  const transaction = new Transaction("Barbie is bezitting", 150, { type: DebitTypes.property }, { type: CreditTypes.none });
  balance.addTransaction(transaction);
}

const addExtraPocketMoney = () => {
  const transaction = new Transaction("Extra pocket money", 50, { type: DebitTypes.cash }, { type: CreditTypes.equity });
  balance.addTransaction(transaction);
}
gsap.registerPlugin(ScrollTrigger);

const scrollTriggerDefaults = {
  start: 'top center-=100px',
};

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
  gsap.to('#add-pocket-money', {
    scrollTrigger: {
      ...scrollTriggerDefaults,
      trigger: '#add-pocket-money',
      onEnter: () => {
        addPocketMoney();
      },
    },
  });
  gsap.to('#fix-pocket-money', {
    scrollTrigger: {
      ...scrollTriggerDefaults,
      trigger: '#fix-pocket-money',
      onEnter: () => {
        adjustPocketMoneyEquity();
      },
    },
  });
  gsap.to('#make-loan-for-barbie', {
    scrollTrigger: {
      ...scrollTriggerDefaults,
      trigger: '#make-loan-for-barbie',
      onEnter: () => {
        makeAloanFor100DebetOnly();
      },
    },
  });
  gsap.to('#credit-for-loan', {
    scrollTrigger: {
      ...scrollTriggerDefaults,
      trigger: '#credit-for-loan',
      onEnter: addLoanToCreditSide,
    },
  });
  gsap.to('#buy-barbie', {
    scrollTrigger: {
      ...scrollTriggerDefaults,
      trigger: '#buy-barbie',
      onEnter: buyBarbie,
    },
  });
  gsap.to('#add-barbie-to-property', {
    scrollTrigger: {
      ...scrollTriggerDefaults,
      trigger: '#add-barbie-to-property',
      onEnter: addBarbieToProperty,
    },
  });
  gsap.to('#add-extra-pocket-money', {
    scrollTrigger: {
      ...scrollTriggerDefaults,
      trigger: '#add-extra-pocket-money',
      onEnter: addExtraPocketMoney,
    },
  });
  gsap.to('#last-explanation', {
    opacity: 1,
    y: 0,
    scrollTrigger: {
      ...scrollTriggerDefaults,
      trigger: '#last-explanation',
      onEnter: () => {
        debitDescription.value = null;
        creditDescription.value = null;
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

</script>

<style scoped>
.explanation-item {
  width: 400px;
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

.scrolly-text-item {
  width: 400px;
}
</style>