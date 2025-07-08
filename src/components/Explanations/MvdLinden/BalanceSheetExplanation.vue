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
        <D3BalanceDrawer :balance="generalBalance" :width="balanceWidth" :height="balanceHeight" :show-amounts="false"/>
      </div>
      <div class="balance" id="central-bank-balance">
        <D3BalanceDrawer :balance="centralBankBalance" :width="balanceWidth" :height="balanceHeight" :show-amounts="false"/>
      </div>
      <div class="balance" id="corporate-bank-balance">
        <D3BalanceDrawer :balance="corporateBankBalance" :width="balanceWidth" :height="balanceHeight" :show-amounts="false"/>
      </div>
    </div>
  </Sheet>
  <ExplanationItemContainer>
    <ScrollyText id="show-standard-balance">
      <p>This is a standard bank balance</p>
    </ScrollyText>
    <ScrollyText id="add-possesion-to-general">
      <p>It consists of three parts: first of all the anything the firm owns on the left (Possessions).</p>
    </ScrollyText>
    <ScrollyText id="add-obligation-to-general">
      <p>Then on the right, the liabilities: everything a firm owes (obligations)</p>
    </ScrollyText>
    <ScrollyText id="add-equity-to-general">
      <p>Also on the right, the equity: net assets belonging to the owners (value of the assets minus value of liabilities)</p>
    </ScrollyText>
    <ScrollyText id="move-default-to-left">
      <p>Now lets move the balance to the right for reference.</p>
    </ScrollyText>
    <ScrollyText id="show-central-bank-balance">
      <p>This is the central bank balance sheet</p>
      <p>A simplified (standard) corporate bank balance sheet consists of seven components.</p>
    </ScrollyText>
    <ScrollyText id="add-gold-to-central">
      <p>The central bank owns gold as part of its assets</p>
    </ScrollyText>
    <ScrollyText id="add-foreign-currencies-to-central">
      <p>Foreign currencies are also part of central bank assets</p>
    </ScrollyText>
    <ScrollyText id="add-bonds-to-central">
      <p>The central bank holds government bonds</p>
    </ScrollyText>
    <ScrollyText id="add-loans-to-central">
      <p>And provides loans to banks</p>
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
import ExplanationItemContainer from "@/components/Scrolly/ExplanationItemContainer.vue";
import ScrollyText from "@/components/Scrolly/ScrollyText.vue";
import {onMounted} from "vue";
import {createMoveToLeftTrigger, createPinnedSheetScrollTrigger, revealBalance} from "@/utils/scrollyUtils";

const generalBalance = new Balance("Standard bank balance");
const centralBankBalance = new Balance("Central bank balance");
const corporateBankBalance = new Balance("Corporate bank balance");

const balanceWidth = 300;
const balanceHeight = 400;

// Default bank balance transactions
const possessionTransaction = Transaction.create("general possesion", 1000, DebitTypes.mlPossessions, CreditTypes.none);
const obligationTransaction = Transaction.create("general obligation", 600, DebitTypes.none, CreditTypes.mlObligations);
const equityTransaction = Transaction.create("general equity", 400, DebitTypes.none, CreditTypes.mlEquities);

// Central bank balance transactions
const goldTransaction = Transaction.create("gold", 150, DebitTypes.mlCentralGold, CreditTypes.none);
const foreignCurrenciesTransaction = Transaction.create("foreign currencies", 150, DebitTypes.mlCentralForeignCurrencies, CreditTypes.none);
const bondsTransaction = Transaction.create("bonds", 300, DebitTypes.mlCentralBonds, CreditTypes.none);
const loansTransaction = Transaction.create("loans to banks", 300, DebitTypes.mlCentralLoansToBanks, CreditTypes.none);


const createRevertableTransaction = (elementName: string, balance: Balance, transaction: Transaction) => {
  const elementId = `#${elementName}`;
  ScrollTrigger.create({
    trigger: elementId,
    start: 'top center-=100px',
    onEnter: () => {
      balance.addTransaction(transaction);
    },
    onEnterBack: () => {
      balance.revertTransaction(transaction);
    }
  });

};
onMounted(() => {
  revealBalance('show-standard-balance','general-balance', balanceWidth);
  const triggerId = 'balances';
  const endTriggerId = 'last-explanation-item';
  createPinnedSheetScrollTrigger(triggerId, endTriggerId);
  createRevertableTransaction('add-possesion-to-general', generalBalance, possessionTransaction);
  createRevertableTransaction('add-obligation-to-general', generalBalance, obligationTransaction);
  createRevertableTransaction('add-equity-to-general', generalBalance, equityTransaction);
  createMoveToLeftTrigger('move-default-to-left', 'general-balance', balanceWidth);

  revealBalance('show-central-bank-balance','central-bank-balance', balanceWidth);
  createRevertableTransaction('add-gold-to-central', centralBankBalance, goldTransaction);
  createRevertableTransaction('add-foreign-currencies-to-central', centralBankBalance, foreignCurrenciesTransaction);
  createRevertableTransaction('add-bonds-to-central', centralBankBalance, bondsTransaction);
  createRevertableTransaction('add-loans-to-central', centralBankBalance, loansTransaction);
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