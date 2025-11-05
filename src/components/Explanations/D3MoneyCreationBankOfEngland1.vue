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
    <h2 class="mt-6 mb-6">Laten we kijken naar de balansen</h2>
    <div class="balances">
      <div class="balance" id="central-bank-balance">
        <D3BalanceDrawer :sketchy="sketchy" :balance="centralBank" :width="balanceWidth" :height="balanceHeight" :show-amounts="false" :max-y="200" />
      </div>
      <div class="balance" id="commercial-bank-balance">
        <D3BalanceDrawer :sketchy="sketchy" :balance="commercialBank" :width="balanceWidth" :height="balanceHeight"
            :show-amounts="false"
            :max-y="200"
        />
      </div>
      <div class="balance" id="person-balance">
        <D3BalanceDrawer :sketchy="sketchy" :balance="personBalance" :width="balanceWidth" :height="balanceHeight" :show-amounts="true" :max-y="200" />
      </div>
    </div>
  </div>
  <div class="explanation-items">
    <div class="scrolly-text-item" id="show-central-bank-balance">
      <p>
        Een commerciële bank maakt dus geld door het verstrekken van een lening.
        Omdate de meeste mensen ervan uitgaan dat alleen de centrale bank geld maakt,
        laten we eerst de balans van de centrale bank zien.
      </p>
    </div>
    <div class="scrolly-text-item" id="move-central-bank-balance-away">
      <p>
        We zien hier de balans van de centrale bank. Alleen de reserves en valuta aan de rechterkant zijn van belang.
      </p>
      <p>
        De reserves zijn namelijk van belang voor de commerciële bank.
      </p>
      <p>Laten we nu deze balans even aan de kant zetten</p>
    </div>
    <div class="scrolly-text-item" id="show-commercial-bank-balance">
      <p>Laten we nu kijken naar de balans van de commerciele bank. Voor nu is alleen de rechterkant van belang: de depositos</p>
    </div>
    <div class="scrolly-text-item" id="show-personal-bank-balance">
      <p>Dan hebben we ook nog de persoonlijke balans van iemand die een hypotheek wil nemen.</p>
    </div>
    <div class="scrolly-text-item" id="person-debit">
      <p>Het doel van een hypotheek is om uiteindelijk een huis te kopen. Om dat huis te kopen
      moet je geld op je rekening hebben staan. Dat is dus een nieuw deposito op de persoonlijke balans</p>
    </div>
    <div class="scrolly-text-item" id="commercial-credit">
      <p>
        Waar staat dat nieuwe geld? Dat staat in eerste instantie op de bank van de persoon.
      </p>
      <p>Het is een schuld aan die persoon, want we zien het aan de credit kant van de bank staan!</p>
    </div>
    <div class="scrolly-text-item" id="person-credit">
      <p>
        De balansen kloppen alleen nog niet. Wat mist er op de persoonlijke balans?
      </p>
      <p>
        Uit waar we het geld vandaan gehaald hebben volgt dat dat een schuld aan de bank is.
      </p>
      <p>
        We zien nu bij de persoon een schuld aan de bank, en bij de bank een schuld aan de persoon. Dit wordt wederzijdse
        shuldaanvaarding genoemd.
      </p>
    </div>
    <div class="scrolly-text-item" id="commercial-debit">
      <p>De enige balans die nog niet goed is, is die van de bank. Deze heeft er ook een bezit bijgekregen:</p>
      <p>De schuld van de persoon aan de bank.</p>
    </div>
    <div class="scrolly-text-item scrolly-text-item--last" id="focus-central-bank">
      <p>Als we nu kijken naar de balans van de centrale bank, blijkt dat daar helemaal niets veranderd is!</p>
    </div>

  </div>
  <div class="sheet last-explanation-item">
    <h2>Wat leren we?</h2>
    <p>
      Hoewel het verhaal gaat dat of centrale banken geld maken, of dat de commerciele bank eerst op geld moet wachten
      blijkt dat in de praktijk niet zo te zijn.
    </p>
  </div>
</template>

<script setup lang="ts">import {Balance, CreditTypes, DebitTypes, Transaction} from "@/balance";
import CircleArrow from "@/components/Svg/CircleArrow.vue";
import D3BalanceDrawer from "@/components/Balance/D3BalanceDrawer.vue";
import {onMounted} from "vue";
import {gsap} from "gsap";
import {ScrollTrigger} from "@/plugins/gsap";

const balanceWidth = 300;
const balanceHeight = 400;

const sketchy = true;

const initScrollytelling = () => {
  gsap.to('#balances-sheet', {
    scrollTrigger: {
      trigger: "#balances-sheet",
      endTrigger: ".last-explanation-item",
      start: 'top-=100px top',
      end: 'top bottom',
      pin: true,
      pinSpacing: false,
    }
  });

  const revealBalance = (trigger: string, target: string) => {
    ScrollTrigger.create({
      trigger,
      start: 'top center-=100px',
      onEnter: () => {
        gsap.set(target, {
          display: "flex",
          width: "0px",
          opacity: 0,
        });
        gsap.to(target, {
          width: `${balanceWidth}px`,
          opacity: 1,
          duration: 1,
          ease: "power2.inOut",
        });
      },
    });
  };

  revealBalance("#show-central-bank-balance", "#central-bank-balance");
  revealBalance("#show-commercial-bank-balance", "#commercial-bank-balance");
  revealBalance("#show-personal-bank-balance", "#person-balance");

  ScrollTrigger.create({
    trigger: "#move-central-bank-balance-away",
    start: 'top center-=100px',
    onEnter: () => {
      const element = document.querySelector("#central-bank-balance");


      const viewportWidth = window.innerWidth;
      const leftPosition = (viewportWidth/2) - (balanceWidth/2);

      gsap.set(element, {
        position: "absolute",
        left: leftPosition,
      });

      gsap.to(element, {
            left: 20,
            ease: "power2.inOut",
            duration: 1,
          })
    },
  });
  const transactionAmount = 100;

  const personDebitTransaction = Transaction.create("Hypotheek", transactionAmount, DebitTypes.newDeposits, CreditTypes.none);

  ScrollTrigger.create({
    trigger: "#person-debit",
    start: 'top center-=100px',
    onEnter: () => {
      personBalance.addTransaction(personDebitTransaction);
    },
    onEnterBack: () => {
      personBalance.revertTransaction(personDebitTransaction);
    }
  });

  const commercialCreditTransaction = Transaction.create("Hypotheek", transactionAmount, DebitTypes.none, CreditTypes.newDeposits);

  ScrollTrigger.create({
    trigger: "#commercial-credit",
    start: 'top center-=100px',
    onEnter: () => {
      commercialBank.addTransaction(commercialCreditTransaction);
    },
    onEnterBack: () => {
      commercialBank.revertTransaction(commercialCreditTransaction);
    }
  });

  const personCreditTransaction = Transaction.create("Hypotheek", transactionAmount, DebitTypes.none, CreditTypes.newLoans);

  ScrollTrigger.create({
    trigger: "#person-credit",
    start: 'top center-=100px',
    onEnter: () => {
      personBalance.addTransaction(personCreditTransaction);
    },
    onEnterBack: () => {
      personBalance.revertTransaction(personCreditTransaction);
    }
  });

  const commercialDebitTransaction = Transaction.create("Hypotheek", transactionAmount, DebitTypes.newLoans, CreditTypes.none);

  ScrollTrigger.create({
    trigger: "#commercial-debit",
    start: 'top center-=100px',
    onEnter: () => {
      commercialBank.addTransaction(commercialDebitTransaction);
    },
    onEnterBack: () => {
      commercialBank.revertTransaction(commercialDebitTransaction);
    }
  });

  ScrollTrigger.create({
    trigger: "#focus-central-bank",
    start: 'top center-=100px',
    onEnter: () => {
      const element = document.querySelector("#central-bank-balance");


      const viewportWidth = window.innerWidth;
      const leftPosition = (viewportWidth/2) - (balanceWidth/2);


      gsap.to(element, {
        left: leftPosition,
        top: '30vh',
        ease: "power2.inOut",
        duration: 1,
      });
      gsap.to("#commercial-bank-balance", {
        opacity: 0.2,
        zIndex: -20,
      });
      gsap.to("#person-balance", {
        opacity: 0.2,
        zIndex: -20,
      });
    },
  })
}


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

#central-bank-balance {
  display: none;
  position: relative;
}

#commercial-bank-balance {
  display: none;
}

#person-balance {
  display: none;
}

.explanation {
  width: 50vw;
}

.scrolly-text-item {
  width: 400px;
}

.scrolly-text-item--last {
  margin-bottom: 90vh;
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
  overflow: hidden;
  justify-content: center;

  &:first-child {
    margin-left: 0;
  }
}</style>