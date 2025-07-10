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
        <D3BalanceDrawer
            :balance="generalBalance"
            :width="balanceWidth"
            :height="balanceHeight"
            :max-y="1000"
            :show-amounts="false"
        />
      </div>
      <div class="balance" id="central-bank-balance">
        <D3BalanceDrawer
            :balance="centralBankBalance"
            :width="balanceWidth"
            :height="balanceHeight"
            :max-y="1000"
            :show-amounts="false"
        />
      </div>
      <div class="balance" id="corporate-bank-balance">
        <D3BalanceDrawer
            :balance="corporateBankBalance"
            :width="balanceWidth"
            :height="balanceHeight"
            :max-y="1000"
            :show-amounts="false"
        />
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
      <p>Now lets move the balance to the left for reference.</p>
    </ScrollyText>
    <ScrollyText id="show-central-bank-balance">
      <p>This is the central bank balance sheet</p>
      <p>A simplified (standard) central bank balance sheet consists of seven components.</p>
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
    <ScrollyText id="add-digital-money-to-central">
      <p>Digital public money represents electronic currency in circulation</p>
    </ScrollyText>
    <ScrollyText id="add-physical-money-to-central">
      <p>Physical public money represents banknotes and coins in circulation</p>
    </ScrollyText>
    <ScrollyText id="add-capital-to-central">
      <p>The central bank's own capital forms its equity</p>
    </ScrollyText>
    <ScrollyText id="move-central-bank-to-right">
      <p>Now lets move the balance of the central bank to the right for reference.</p>
    </ScrollyText>
    <ScrollyText id="show-corporate-bank-balance">
      <p>This is the corporate bank balance sheet</p>
    </ScrollyText>
    <ScrollyText id="add-digital-public-money-to-corporate">
      <p>Corporate banks hold digital public money from the central bank</p>
    </ScrollyText>
    <ScrollyText id="add-physical-public-money-to-corporate">
      <p>They also hold physical public money (cash)</p>
    </ScrollyText>
    <ScrollyText id="add-bonds-to-corporate">
      <p>Corporate banks invest in bonds</p>
    </ScrollyText>
    <ScrollyText id="add-loans-to-banks-to-corporate">
      <p>They provide loans to other banks</p>
    </ScrollyText>
    <ScrollyText id="add-loans-to-non-banks-to-corporate">
      <p>And provide loans to non-bank entities</p>
    </ScrollyText>
    <ScrollyText id="add-insured-private-money-to-corporate">
      <p>They have insured private money as liability</p>
    </ScrollyText>
    <ScrollyText id="add-uninsured-private-money-to-corporate">
      <p>And uninsured private money</p>
    </ScrollyText>
    <ScrollyText id="add-loans-from-banks-to-corporate">
      <p>They receive loans from other banks</p>
    </ScrollyText>
    <ScrollyText id="add-long-term-depths-to-corporate">
      <p>Have long-term debt obligations</p>
    </ScrollyText>
    <ScrollyText id="add-capital-to-corporate">
      <p>And maintain their own capital</p>
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
import {createMoveToSideTrigger, createPinnedSheetScrollTrigger, revealBalance} from "@/utils/scrollyUtils";
import {createRevertableTransaction} from "@/utils/balanceUtils";

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
const bondsTransaction = Transaction.create("bonds", 350, DebitTypes.mlCentralBonds, CreditTypes.none);
const loansTransaction = Transaction.create("loans to banks", 350, DebitTypes.mlCentralLoansToBanks, CreditTypes.none);

const digitalPublicMoneyTransaction = Transaction.create("digital public money", 550, DebitTypes.none, CreditTypes.mlCentralDigitalPublicMoney);
const physicalPublicMoneyTransaction = Transaction.create("physical public money", 300, DebitTypes.none, CreditTypes.mlCentralPhysicalPublicMoneyInCirculation);
const capitalTransaction = Transaction.create("central capital", 150, DebitTypes.none, CreditTypes.mlCentralCapital);

// Corporate bank balance transactions
const corporateDigitalMoneyTransaction = Transaction.create("corporate digital money", 200, DebitTypes.mlCorporateDigitalPublicMoney, CreditTypes.none);
const corporatePhysicalMoneyTransaction = Transaction.create("corporate physical money", 100, DebitTypes.mlCorporatePhysicalPublicMoney, CreditTypes.none);
const corporateBondsTransaction = Transaction.create("corporate bonds", 300, DebitTypes.mlCorporateBonds, CreditTypes.none);
const corporateLoansToBanksTransaction = Transaction.create("corporate loans to banks", 200, DebitTypes.mlCorporateLoansToBanks, CreditTypes.none);
const corporateLoansToNonBanksTransaction = Transaction.create("corporate loans to non-banks", 400, DebitTypes.mlCorporateLoansToNonBanks, CreditTypes.none);

const corporateInsuredMoneyTransaction = Transaction.create("corporate insured money", 400, DebitTypes.none, CreditTypes.mlCorporateInsuredPrivateMoney);
const corporateUninsuredMoneyTransaction = Transaction.create("corporate uninsured money", 300, DebitTypes.none, CreditTypes.mlCorporateUninsuredPrivateMoney);
const corporateLoansFromBanksTransaction = Transaction.create("corporate loans from banks", 200, DebitTypes.none, CreditTypes.mlCorporateLoansFromBanks);
const corporateLongTermDepthsTransaction = Transaction.create("corporate long term depths", 200, DebitTypes.none, CreditTypes.mlCorporateLongTermDepths);
const corporateCapitalTransaction = Transaction.create("corporate capital", 100, DebitTypes.none, CreditTypes.mlCorporateCapital);

onMounted(() => {
  revealBalance('show-standard-balance','general-balance', balanceWidth);
  const triggerId = 'balances';
  const endTriggerId = 'last-explanation-item';
  createPinnedSheetScrollTrigger(triggerId, endTriggerId);
  createRevertableTransaction('add-possesion-to-general', generalBalance, possessionTransaction);
  createRevertableTransaction('add-obligation-to-general', generalBalance, obligationTransaction);
  createRevertableTransaction('add-equity-to-general', generalBalance, equityTransaction);
  createMoveToSideTrigger('move-default-to-left', 'general-balance', balanceWidth);

  revealBalance('show-central-bank-balance','central-bank-balance', balanceWidth);
  createRevertableTransaction('add-gold-to-central', centralBankBalance, goldTransaction);
  createRevertableTransaction('add-foreign-currencies-to-central', centralBankBalance, foreignCurrenciesTransaction);
  createRevertableTransaction('add-bonds-to-central', centralBankBalance, bondsTransaction);
  createRevertableTransaction('add-loans-to-central', centralBankBalance, loansTransaction);
  createRevertableTransaction('add-digital-money-to-central', centralBankBalance, digitalPublicMoneyTransaction);
  createRevertableTransaction('add-physical-money-to-central', centralBankBalance, physicalPublicMoneyTransaction);
  createRevertableTransaction('add-capital-to-central', centralBankBalance, capitalTransaction);

  createMoveToSideTrigger('move-central-bank-to-right', 'central-bank-balance', balanceWidth, 'right');

  revealBalance('show-corporate-bank-balance', 'corporate-bank-balance', balanceWidth);
  createRevertableTransaction('add-digital-public-money-to-corporate', corporateBankBalance, corporateDigitalMoneyTransaction);
  createRevertableTransaction('add-physical-public-money-to-corporate', corporateBankBalance, corporatePhysicalMoneyTransaction);
  createRevertableTransaction('add-bonds-to-corporate', corporateBankBalance, corporateBondsTransaction);
  createRevertableTransaction('add-loans-to-banks-to-corporate', corporateBankBalance, corporateLoansToBanksTransaction);
  createRevertableTransaction('add-loans-to-non-banks-to-corporate', corporateBankBalance, corporateLoansToNonBanksTransaction);
  createRevertableTransaction('add-insured-private-money-to-corporate', corporateBankBalance, corporateInsuredMoneyTransaction);
  createRevertableTransaction('add-uninsured-private-money-to-corporate', corporateBankBalance, corporateUninsuredMoneyTransaction);
  createRevertableTransaction('add-loans-from-banks-to-corporate', corporateBankBalance, corporateLoansFromBanksTransaction);
  createRevertableTransaction('add-long-term-depths-to-corporate', corporateBankBalance, corporateLongTermDepthsTransaction);
  createRevertableTransaction('add-capital-to-corporate', corporateBankBalance, corporateCapitalTransaction);
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