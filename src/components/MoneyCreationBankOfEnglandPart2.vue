<template>
  <div class="flex flex-col">
    <div class="px-4 border mr-4">
      <div v-if="currentStep == Steps.initial">
        <h3>Geld creatie uitgelegd door de Bank of England (2/3)</h3>
        <p>
          Laten we kijken wat er gebeurt als iemand een huis koopt van iemand anders.
          We hebben de volgende balansen getekend:
        </p>
        <ul>
          <li>Balans van de koper</li>
          <li>Balans van de verkoper</li>
          <li>Balans van de bank van de koper</li>
          <li>Balans van de bank van de verkoper</li>
        </ul>
        <p>
          Voordat de koper een huis kan kopen, moet hij eerst een hypotheek nemen.
          Hiertoe maakt de bank van de koper eerst een lening en een deposito aan.
        </p>
        <p>
          <button class="btn" @click="createMoney" :disabled="currentStep != Steps.initial || animating">Maak lening en
            deposito
          </button>
        </p>
      </div>
      <div v-if="currentStep == Steps.moneyCreated">
        <p>Nu is het geld bij bank gemaakt. Nu moet het nog bij de koper terechtkomen.
          Eigenlijk is dat al gebeurd, maar voor nu is het duidelijker als we dat in een aparte stap doen:
        </p>
        <p>
          <button
              @click="createMoneyOnBuyersBalance"
              :disabled="currentStep != Steps.moneyCreated || animating"
              class="btn"
          >Zet het geleende bedrag op de rekening van de koper</button>
        </p>
      </div>
      <div v-if="currentStep == Steps.moneyOnBuyersAccount">
        <p>
          Je ziet dat bij de koper de nieuwe lening aan de verplichtingen kant is komen te staan.
          Daar staat een nieuw deposito tegenover.
        </p>
        <p>Voor de koper is lening een verplichting, voor de bank is een deposito feitelijk een schuld aan de koper.
          Omdat beide partijen allebei een schuld aangaan met wederzijds goedvinden wordt dit ook wel 'Wederzijdse schuld aanvaarding genoemd.'</p>
        <p>
          Nu koopt de koper het huis. Dat betekent dat zijn geld (deposito) naar verkoper gaat. Hij krijgt daar een huis voor terug.
        </p>
        <p><button
            class="btn"
            @click="buyHouse"
            :disabled="currentStep != Steps.moneyOnBuyersAccount || animating"
        >Koop huis</button></p>
      </div>
      <div v-if="currentStep == Steps.houseBought">
        <p>Nu is het huis gekocht, maar het deposito van de koper staat nog bij de bank van de koper.
        Dit moet nu naar de bank van de verkoper worden overgegeven. De bank van de koper kan dit alleen doen
        door centrale bank reserves over te maken aan de bank van de verkoper.</p>
        <p><button
            class="btn"
            @click="transferReserves"
            :disabled="currentStep != Steps.houseBought || animating"
        >Transfer reserves</button></p>

      </div>
      <div v-if="currentStep == Steps.reservesTransferred">
        <p>Nu zijn de reserves van de ene naar de andere kant gegaan. Je ziet dat de reserves van bank van de verkoper
        nu wel heel laag is. Daar gaat die bank wat aan willen doen.</p>
      </div>
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

enum Steps {
  initial,
  moneyCreated,
  moneyOnBuyersAccount,
  houseBought,
  reservesTransferred,
  bankBuyerLoansFromSellersBank
}

let currentStep = ref(Steps.initial);
let animating = ref(false);

const advanceStep = () => {
  switch (currentStep.value) {
    case Steps.initial:
      // Move to the next step
      currentStep.value = Steps.moneyCreated;
      break;
    case Steps.moneyCreated:
      currentStep.value = Steps.moneyOnBuyersAccount;
      break;
    case Steps.moneyOnBuyersAccount:
      currentStep.value = Steps.houseBought;
      break;
    case Steps.houseBought:
      currentStep.value = Steps.reservesTransferred;
      break;
    case Steps.reservesTransferred:
      currentStep.value = Steps.bankBuyerLoansFromSellersBank;
      break;
    case Steps.bankBuyerLoansFromSellersBank:
      break;
    default:
      console.error("Unknown step.");
  }
};

const createMoney = () => {
  const transaction = Transaction.create("Create loan", 70, DebitTypes.newLoans, CreditTypes.newDeposits);
  animating.value = true;
  buyersBank.balance.addTransaction(transaction);
  buyersBank.waitForFadeToEnd().then(() => {
    animating.value = false;
    advanceStep();
  })
}

const createMoneyOnBuyersBalance = () => {
  const transaction = Transaction.create("Create loan", 80, DebitTypes.newDeposits, CreditTypes.newLoans);
  animating.value = true;
  houseBuyer.balance.addTransaction(transaction);
  houseBuyer.waitForFadeToEnd().then(() => {
    animating.value = false;
    advanceStep();
  })
}

const wait = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const buyHouse = () => {
  const transaction = Transaction.create("Buy house 1", -80, DebitTypes.newDeposits, CreditTypes.none);
  const transaction3 = Transaction.create("Buy house 3", 80, DebitTypes.newDeposits, CreditTypes.none);
  const transaction2 = Transaction.create("Buy house 2", -80, DebitTypes.nonMoneyHouse, CreditTypes.none);
  const transaction4 = Transaction.create("Buy house 4", 80, DebitTypes.nonMoneyHouse, CreditTypes.none);

  animating.value = true;

  houseBuyer.balance.addTransaction(transaction);
  houseSeller.balance.addTransaction(transaction3);
  houseBuyer.waitForFadeToEnd()
      .then(() => {
        return houseSeller.waitForFadeToEnd();
      })
      .then(() => wait(1000))
      .then(() => {
        houseSeller.balance.addTransaction(transaction2);
        houseBuyer.balance.addTransaction(transaction4);
        return houseSeller.waitForFadeToEnd();
      })
      .then(() => {
        animating.value = false;
        advanceStep();
      })
}

const transferReserves = () => {
  const transactionLessReserves = Transaction.create("Transfer reserves to sellers bank", -70, DebitTypes.reserves, CreditTypes.newDeposits);
  const reservesAndNewDeposits = Transaction.create("Transfer reserves and new deposits", 70, DebitTypes.reserves, CreditTypes.newDeposits);

  animating.value = true;
  buyersBank.balance.addTransaction(transactionLessReserves)
  sellersBank.balance.addTransaction(reservesAndNewDeposits);
  sellersBank.waitForFadeToEnd().then(() => {
    animating.value = false;
    advanceStep();
  })
}

enum Balances {
  houseBuyer = "Huis koper",
  houseSeller = "Huis verkoper",
  buyersBank = "Bank van koper",
  sellersBank = "Bank van verkoper",
}

const createStartSituation = () => {
  houseBuyer.balance.debit[DebitTypes.currency] = 30;
  houseBuyer.balance.debit[DebitTypes.deposits] = 50;
  houseBuyer.balance.credit[CreditTypes.noneMoney] = 80;

  houseSeller.balance.debit[DebitTypes.currency] = 30;
  houseSeller.balance.debit[DebitTypes.deposits] = 50;
  houseSeller.balance.debit[DebitTypes.nonMoneyHouse] = 80;
  houseSeller.balance.credit[CreditTypes.noneMoney] = 160;

  buyersBank.balance.debit[DebitTypes.currency] = 30;
  buyersBank.balance.debit[DebitTypes.reserves] = 80;
  buyersBank.balance.credit[CreditTypes.deposits] = 110;

  sellersBank.balance.debit[DebitTypes.currency] = 30;
  sellersBank.balance.debit[DebitTypes.reserves] = 80;
  sellersBank.balance.credit[CreditTypes.deposits] = 110;
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
      const buyerSellerPositionY = 300;
      houseBuyer.properties.positionY = buyerSellerPositionY;
      houseBuyer.debitCreditWiths = debitCreditWiths;
      houseBuyer.drawAmounts = false;
      houseSeller.properties.positionY = buyerSellerPositionY;
      houseSeller.properties.positionX = 430;
      houseSeller.debitCreditWiths = debitCreditWiths;
      houseSeller.drawAmounts = false;
      buyersBank.properties.positionY = 530;
      buyersBank.debitCreditWiths = debitCreditWiths;
      buyersBank.drawAmounts = false;
      sellersBank.properties.positionY = 530;
      sellersBank.properties.positionX = 430;
      sellersBank.debitCreditWiths = debitCreditWiths;
      sellersBank.drawAmounts = false;

      createStartSituation()
    });
    p5Instance = new p5(sketch, canvasContainer.value);
  }
})
</script>

<style scoped>

</style>