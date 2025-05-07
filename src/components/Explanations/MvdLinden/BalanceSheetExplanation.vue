<template>
  <SheetFirst title="Bank balansen uitgelegd">
    <p>
      A reason for ambiguous explanations might be that balance sheets and T-accounts are often not used in analyses of the monetary and financial system. Non-economists but also most economist are not used taking a balance sheet perspective. Balance sheets are an objective way to study the current banking-based monetary and financial system, because banking is based on balance sheets, and, as said, corporate and central bankers use and think in terms of balance sheets themselves.

      This explanation of the functioning of onshore (domestic) banking is based on the explanations of bankers, i.e. economists with practical banking experience (Pozsar et al. 2010, 2013; Sheard 2013; Cliffe and Brosens 2014, 2018; McMillan 2014; McLeay et al. 2014a, 2014b; Lipton 2015; King 2016; Boonstra 2018; Boonstra and van Goor 2021) and uses colorful visualizations. In a next article offshore and international banking will be explained.
    </p>
  </SheetFirst>
  <Sheet id="balances">
    <div class="balances">
      <div class="balance" id="general-balance">
        <D3BalanceDrawer :balance="generalBalance" :width="balanceWidth" :height="balanceHeight"/>
      </div>
      <div class="balance" id="central-bank-balance">
      <D3BalanceDrawer :balance="centralBankBalance" :width="balanceWidth" :height="balanceHeight"/>
      </div>
      <div class="balance" id="corporate-bank-balance">
      <D3BalanceDrawer :balance="corporateBankBalance" :width="balanceWidth" :height="balanceHeight"/>
      </div>
    </div>
  </Sheet>
  <ExplanationItemContainer>
    <ScrollyText id="show-standard-balance">
      <p>This is the first explanation item</p>
    </ScrollyText>
    <ScrollyText id="last-explanation-item">
      <p>This is the last explanation item</p>
    </ScrollyText>
  </ExplanationItemContainer>

</template>

<script setup lang="ts">
import SheetFirst from "@/components/Scrolly/SheetFirst.vue";
import Sheet from "@/components/Scrolly/Sheet.vue";
import {Balance, CreditTypes, DebitTypes, Transaction} from "@/balance";
import D3BalanceDrawer from "@/components/Balance/D3BalanceDrawer.vue";
import {ScrollTrigger} from "@/plugins/gsap";
import {gsap} from "gsap";
import ExplanationItemContainer from "@/components/Scrolly/ExplanationItemContainer.vue";
import ScrollyText from "@/components/Scrolly/ScrollyText.vue";
import {onMounted} from "vue";

const generalBalance = new Balance("Standard bank balance");
const centralBankBalance = new Balance("Central bank balance");
const corporateBankBalance = new Balance("Corporate bank balance");

const balanceWidth = 300;
const balanceHeight = 400;

const revealBalance = (trigger: string, target: string) => {
  ScrollTrigger.create({
    trigger: `#${trigger}`,
    start: 'top center-=100px',
    onEnter: () => {
      const targetId = `#${target}`;
      gsap.set(targetId, {
        display: "flex",
        width: "0px",
        opacity: 0,
      });
      gsap.to(targetId, {
        width: `${balanceWidth}px`,
        opacity: 1,
        duration: 1,
        ease: "power2.inOut",
      });
    },
  });
};


const possessionTransaction = Transaction.create("general possesion", 1000, DebitTypes.mlPossessions, CreditTypes.none);
const obligationTransaction = Transaction.create("general obligation", 600, DebitTypes.none, CreditTypes.mlObligations);
const equityTransaction = Transaction.create("general equity", 400, DebitTypes.none, CreditTypes.mlEquities);

function createPinnedSheetScrollTrigger(trigger: string, endTrigger: string) {
  const triggerId = `#${trigger}`;
  const endTriggerID = `#${endTrigger}`;
  ScrollTrigger.create({
    trigger: triggerId,
    endTrigger: endTriggerID,
    start: 'top-=100px top',
    end: 'top top',
    pin: true,
    pinSpacing: false,
    markers: true,
  })
}

onMounted(() => {
  revealBalance('show-standard-balance','general-balance');
  const triggerId = 'balances';
  const endTriggerId = 'last-explanation-item';
  createPinnedSheetScrollTrigger(triggerId, endTriggerId);
});
</script>

<style scoped>
.balances {
  @apply flex flex-row justify-around;
}


#general-balance {
  display: none;
  position: relative;
}
#central-bank-balance {
  display: none;
  position: relative;
}

#corporate-bank-balance {
  display: none;
}

</style>