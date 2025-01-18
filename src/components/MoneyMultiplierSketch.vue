<template>
  <p>
    Om geldschepping door commerciele banken te begrijpen, moet je eerst weten dat er 2 types geld zijn: <br />
    - Cash: oftewel basis geld <br />
    - Giraal geld: dit geld zie je op je bankrekening. <br />
  </p>
  <p><button
      v-show="totalMoney < 200" @click="depositToBank1"
      class="btn"
  >Stort geld op de {{ Banks.bank1 }}
  </button></p>
  <p><button
      v-show="totalMoney >= 200 && totalMoney < 390"
      @click="buyAndmoveMoneyToBank2"
      class="btn"
  >Transfer naar de {{ Banks.bank2 }}
  </button></p>
  <p><button
      v-show="totalMoney >= 390 && totalMoney < 570"
      @click="moveMoneyToBank3from2"
      class="btn"
  >Transfer € 180 van de {{ Banks.bank2 }} naar de {{ Banks.bank3}}
  </button></p>
  <p><button
      v-show="totalMoney >= 570"
      @click="moveMoneyToBank4from3"
      class="btn"
  >Transfer € 170 van de {{ Banks.bank3 }} naar de {{ Banks.bank4}}
  </button></p>
  <p>
    De totale geldhoeveelheid:
  </p>
  <div class="bg-green-400 px-4 py-2 bar" ref="totalCashDiv">
    Cash: {{ totalCash.toLocaleString('nl-NL', {style: 'currency', currency: 'EUR'}) }}
  </div>
  <div class="bg-blue-400 px-4 py-2 bar" ref="totalMoneyDiv">
    Totaal giraal: {{ totalMoney.toLocaleString('nl-NL', {style: 'currency', currency: 'EUR'}) }}
  </div>
  <div class="bg-purple-400 px-4 py-2 bar" ref="cashPercentageDiv">
    Percentagec cash: {{ percentageCash.toFixed(1) }} %
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
  person1.moveFromTo({
        x: 550,
        y: 10,
      },
      {
        x: bank.getPosition().x,
        y: bank.getPosition().y,
      });
  return money.moveFromTo(
      {
        x: 550,
        y: 10
      },
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
      .then(updateTotals);
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
      .then(updateTotals)
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

.total-money {
  width: 0;
}

.bar {
  width: 30px;
}

</style>