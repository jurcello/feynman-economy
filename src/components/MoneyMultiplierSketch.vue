<template>
  <div class="explanation">
    <template  v-if="currentState == state.initial">
      <p>
        Om geldschepping door commerciele banken te begrijpen, moet je eerst weten dat er 2 types geld zijn: <br />
        - Cash: oftewel basis geld <br />
        - Giraal geld: dit geld zie je op je bankrekening. <br />
        We hebben in dit voorbeeld 4 banken waar nog geen geld naartoe gegaan is. Laten we eerst een aantal mensen geld op een spaarrekening laten storten.
      </p>
      <p><button
          @click="depositToBank1"
          class="btn"
      >Laat mensen geld storten op de {{ Banks.bank1 }}
      </button></p>
    </template>
    <template v-if="currentState == state.moneyDeposited">
      <p>Alle mensen hebben nu bij elkaar {{ totalCash.toLocaleString('nl-NL', {style: 'currency', currency: 'EUR'}) }} gestort.
      Op de balans van de bank zie je bij de rekeningen hetzelfde bedrag staan. Je zou ook kunnen zeggen dat er dus {{ totalCash.toLocaleString('nl-NL', {style: 'currency', currency: 'EUR'}) }}
        aan giraal geld is. In de balken hieronder zie je de verschillende geldhoeveelheden in een balk staan.
      </p>
      <p>Tegenover {{ totalCash.toLocaleString('nl-NL', {style: 'currency', currency: 'EUR'}) }} giraal staat hetzelfde bedrag in cash. Je ziet dat al het girale geld is gedekt door cash geld.
        Het dekken van giraal geld door 'echt' geld noemen de dekkingsgraad.
        Die dekkingsgraad kunnen we ook in een balk weergeven.
      </p>
      <button class="btn"
          @click="currentState = state.coverageExplained"
      >
        Laat dekkingspercentage van giraal geld zien
      </button>
    </template>
    <template v-if="currentState == state.coverageExplained">
      <p>Als dit alles was, wat banken zouden kunnen doen, zouden ze moeilijk geld kunnen verdienen.
        Het verhaal in de economsische leerboeken is, dat banken al snel beseften dat niet iedereen tegelijk haar/zijn
        spaargeld zou opnemen.
        Het zou dus prima zijn om een deel van het geld weer uit te lenen als iemand iets nodig had en niet direct geld.
        Stel nou dat iemand een auto wil kopen met geleend geld? Hij heeft € 190,00 nodig. De bank heeft zoveel geld wel
        in cash en leent hem dit uit.
        Laten we eens kijken wat er dan gebeurt:</p>
      <button class="btn"
          @click="buyAndmoveMoneyToBank2">
        Laat John een auto kopen van Alice
      </button>

    </template>
    <template v-if="currentState == state.carBought">
      <p>Je zag dat John geld leende van de eerste bank en daarmee Alice betaalde voor de auto.
        Omdat Alice haar geld niet in een sok bewaard, stort zij op haar beurt het geld weer op een spaarrekening bij
        een andere bank.
        Als we nu naar kijken naar de totale hoeveelheid giraal geld, is deze gegroeid (zie balkje). Niet al het geld is
        nu meer gedekt door cash geld!
      </p>
      <p>Dit proces kun je natuurlijk herhalen. Laten we dat een aantal keer doen. Om tijd te winnen zien we niet de koop van iets, maar het idee is hetzelfde.</p>
      <button
          @click="moveMoneyToBank3from2"
          class="btn"
      >Iemand leent iets bij {{ Banks.bank2}} om iets te kopen. De verkoper zet het geld weer op de {{ Banks.bank3 }}
      </button>

    </template>
    <template v-if="currentState == state.moneyMovedToBank3">
      <p>
        Natuurlijk kunnen we dit nog een keer herhalen
      </p>
      <button
          @click="moveMoneyToBank4from3"
          class="btn"
      >Iemand leent iets bij {{ Banks.bank3}} om iets te kopen. De verkoper zet het geld weer op de {{ Banks.bank4 }}
      </button>
    </template>
    <template v-if="currentState == state.moneyMovedToBank4">
      <p>Een bank kan natuurlijk niet altijd door blijven gaan geld uit te lenen. Hij moet wel voldoende in cash hebben om, als iemand iets van zijn spaarrekening
        wil opnemen, dit geld ook beschikbaar te hebben.
      </p>
      <p>
        Er moet dus altijd een minimale reserve cash zijn (ofwel dekkingsgraag). Stel nou dat dit 10%.
        Laten we eens kijken naar de dekkingsgraad van de {{ Banks.bank1 }}. Deze is op dit moment:
        {{ bank1.balance.getCoverage().toFixed(1) }} %.
      </p>
      <p>Laten we eens kijken wat een bank zou moeten doen als Alice nu een lening zou willen afsluiten</p>
      <button class="btn"
          @click="aliceTriesLoan"
      >
        Laat Alice proberen een lening af te sluiten
      </button>
    </template>
  </div>
  <h3>
    De totale geldhoeveelheid:
  </h3>
  <div class="bar-container">
    <div class="bg-green-400 bar" ref="totalCashDiv">
    </div>
    <div class="bar-text">
      Cash: {{ totalCash.toLocaleString('nl-NL', {style: 'currency', currency: 'EUR'}) }}
    </div>
  </div>
  <div class="bar-container">
    <div class="bg-blue-400 bar" ref="totalMoneyDiv">

    </div>
    <div class="bar-text">
      Totaal giraal: {{ totalMoney.toLocaleString('nl-NL', {style: 'currency', currency: 'EUR'}) }}
    </div>
  </div>
  <div class="bar-container" v-show="currentState >= state.coverageExplained">
    <div class="bg-purple-400 bar" ref="cashPercentageDiv">
    </div>
    <div class="bar-text">Dekking van giraal geld: {{ percentageCash.toFixed(1) }} %</div>
  </div>
  <div class="canvas" ref="canvasContainer">
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";
import p5 from "p5";
import moneyMultiplier from "@/sketches/moneyMultiplier";
import MovableImage from "@/sketches/Animatables/MovableImage";
import Society from "@/sketches/Animatables/Society";
import BalanceDrawerExtended from "@/sketches/Animatables/BalanceDrawerExtended";
import {CreditTypes, DebitTypes, Transaction} from "@/balance";
import {gsap} from "gsap";
import PositionMarker from "@/sketches/Animatables/PositionMarker";

enum state {
  initial = 1,
  moneyDeposited = 2,
  coverageExplained = 3,
  carBought = 4,
  moneyMovedToBank3 = 5,
  moneyMovedToBank4 = 6,
  done = 7,
}

let currentState = ref<state>(state.initial);

enum Banks {
  bank1 = "Rabobank",
  bank2 = "Asn bank",
  bank3 = "Triodos bank",
  bank4 = "ING bank",
}

const canvasContainer = ref<HTMLDivElement | null>(null);
const totalCashDiv = ref<HTMLDivElement | null>(null);
const totalMoneyDiv = ref<HTMLDivElement | null>(null);
const cashPercentageDiv = ref<HTMLDivElement | null>(null);
let p5Instance: p5 | null = null;

let money: MovableImage;
let person1: MovableImage;
let person2: MovableImage;
let car: MovableImage;
let society: Society;
let bank1: BalanceDrawerExtended;
let bank2: BalanceDrawerExtended;
let bank3: BalanceDrawerExtended;
let bank4: BalanceDrawerExtended;
let totalMoney = ref<number>(0);
let totalCash = ref<number>(0);
let percentageCash = ref<number>(0);

const speed = 1;

const spawnPoint = {
  x: 550,
  y: 10,
};

const marketPosition1Person1 = new PositionMarker(150, 40);
const marketPosition1Person2 = marketPosition1Person1.add(150,0);


const gsapDuration = 1;
const updateTotals = () => {
  const totals = society.getMoneyAggregates();
  totalMoney.value = totals.total;
  console.log('updating', totalMoney.value);
  gsap.to(totalMoneyDiv.value, {
    width: totalMoney.value,
    duration: gsapDuration,
  });
  totalCash.value = totals.cash;
  gsap.to(totalCashDiv.value, {
    width: totalCash.value,
    duration: gsapDuration,
  });
  percentageCash.value = totals.cash / totals.total * 100;
  gsap.to(cashPercentageDiv.value, {
    width: percentageCash.value + '%',
    duration: gsapDuration,
  })
};

onMounted(() => {
  if (canvasContainer.value) {
    const sketch = moneyMultiplier(canvasContainer.value, [Banks.bank1, Banks.bank2, Banks.bank3, Banks.bank4], (result) => {
      money = result.money;
      person1 = result.person1;
      person2 = result.person2;
      society = result.society;
      car = result.car;

      person1.offset.x = 35;
      person1.offset.y = -10;
      person2.offset.x = -35;
      person2.offset.y = 0;

      money.speed = speed;
      person1.speed = speed;
      person2.speed = speed;
      car.speed = speed;

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

function depositMoneyToBank(bank: BalanceDrawerExtended, amount: number) {
  person1.moveFromTo(spawnPoint,
      {
        x: bank.getPosition().x,
        y: bank.getPosition().y,
      });
  return money.moveFromTo(
      spawnPoint,
      bank.getPosition()
  ).then(() => {

    const transaction = new Transaction("storting", amount, {type: DebitTypes.cash}, {type: CreditTypes.savingsAccount});
    bank.balance.addTransaction(transaction);
    return bank.waitForFadeToEnd();
  }).then(() => {
    updateTotals();
    person1.disappear();
    money.disappear();
  })
}

const depositToBank1 = () => {
  money.speed = 10;
  person1.speed = 10;
  depositMoneyToBank(bank1, 5)
      .then(() => depositMoneyToBank(bank1, 10))
      .then(() => depositMoneyToBank(bank1, 5))
      .then(() => depositMoneyToBank(bank1, 10))
      .then(() => depositMoneyToBank(bank1, 7))
      .then(() => depositMoneyToBank(bank1, 9))
      .then(() => depositMoneyToBank(bank1, 15))
      .then(() => depositMoneyToBank(bank1, 3))
      .then(() => depositMoneyToBank(bank1, 9))
      .then(() => depositMoneyToBank(bank1, 7))
      .then(() => depositMoneyToBank(bank1, 18))
      .then(() => depositMoneyToBank(bank1, 15))
      .then(() => depositMoneyToBank(bank1, 13))
      .then(() => depositMoneyToBank(bank1, 7))
      .then(() => depositMoneyToBank(bank1, 4))
      .then(() => depositMoneyToBank(bank1, 10))
      .then(() => depositMoneyToBank(bank1, 20))
      .then(() => depositMoneyToBank(bank1, 13))
      .then(() => depositMoneyToBank(bank1, 6))
      .then(() => depositMoneyToBank(bank1, 8))
      .then(() => depositMoneyToBank(bank1, 6))
      .then(() => {
        money.speed = 1;
        person1.speed = 1;
        currentState.value = state.moneyDeposited;
      });
}

const buyAndmoveMoneyToBank2 = () => {
  let amount = 190;
  const transaction1 = new Transaction("Lening", - amount, { type: DebitTypes.cash }, { type: CreditTypes.none});
  const transaction2 = new Transaction("Lening", amount, { type: DebitTypes.loan }, { type: CreditTypes.none});
  const transaction3 = new Transaction("storting", amount, { type: DebitTypes.cash }, { type: CreditTypes.savingsAccount});

  bank1.balance.addTransaction(transaction1);
  bank1.waitForFadeToEnd().then(() => {
    bank1.balance.addTransaction(transaction2);
    return bank1.waitForFadeToEnd();
  })
      .then(() => {
        money.moveFromTo(bank1.getPosition(), marketPosition1Person1);
        return person1.moveFromTo(bank1.getPosition(), marketPosition1Person1);
      })
      .then(() => {
        let from = {x: 400, y: 10};
        person2.moveFromTo(from, marketPosition1Person2);
        return car.moveFromTo(from, marketPosition1Person2);
      })
      .then(() => money.moveTo(marketPosition1Person2))
      .then(() => car.moveTo(marketPosition1Person1))
      .then(() => {
        person1.disappear();
        return car.disappear();
      })
      .then(() => {
        person2.moveTo(bank2.getPosition());
        return money.moveTo(bank2.getPosition());
      })
      .then(() => {
        bank2.balance.addTransaction(transaction3);
        return bank2.waitForFadeToEnd();
      })
      .then(() => person2.disappear())
      .then(() => money.disappear())
      .then(() => {
        updateTotals();
        currentState.value = state.carBought;
      });
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
  })
      .then(() => {
        money.moveFromTo(bank2.getPosition(), bank3.getPosition())
      })
      .then(() => {
          bank3.balance.addTransaction(transaction3);
          return bank3.waitForFadeToEnd();
        })
      .then(() => {
        updateTotals();
        currentState.value = state.moneyMovedToBank3;
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
    }).then(() => {
      updateTotals();
      money.disappear();
      currentState.value = state.moneyMovedToBank4;
    });
  })
}

const aliceTriesLoan = () => {
  person2.moveFromTo(spawnPoint, bank1.getPosition()).then(() => {});
}

</script>

<style scoped>

.bar-container {
  @apply relative h-8 flex border border-gray-200 my-2
}
.bar-text {
  @apply absolute top-0 leading-8 px-4;
}

.canvas {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.total-money {
  width: 0;
}

.bar {
  @apply leading-8;
}

</style>