import {CreditTypes, DebitTypes} from "@/balance";

const creditDict:{[key: string]: string} = {
    [CreditTypes.mlCentralDigitalPublicMoney]: "Digital Public Money",
    [CreditTypes.mlCentralPhysicalPublicMoneyInCirculation]: "Physical Public Money in Circulation",
    [CreditTypes.mlCentralCapital]: "Capital",
    [CreditTypes.mlCorporateInsuredPrivateMoney]: "Insured Private Money",
    [CreditTypes.mlCorporateUninsuredPrivateMoney]: "Uninsured Private Money",
    [CreditTypes.mlCorporateLoansFromBanks]: "Loans from Banks",
    [CreditTypes.mlCorporateLongTermDepths]: "Long Term Depths",
    [CreditTypes.mlCorporateCapital]: "Capital",
}

const debitDict: {[key: string]: string} = {
    [DebitTypes.mlCentralForeignCurrencies]: "Foreign Currencies",
    [DebitTypes.mlCentralBonds]: "Bonds",
    [DebitTypes.mlCentralLoansToBanks]: "Loans to Banks",
    [DebitTypes.mlCorporateDigitalPublicMoney]: "Digital Public Money",
    [DebitTypes.mlCorporatePhysicalPublicMoney]: "Physical Public Money",
    [DebitTypes.mlCorporateBonds]: "Bonds",
    [DebitTypes.mlCorporateLoansToBanks]: "Loans to Banks",
    [DebitTypes.mlCorporateLoansToNonBanks]: "Loans to Non-Banks",
}

function translateCreditType(creditType: string) {
    if (creditType in creditDict) {
        return creditDict[creditType];
    }
    return creditType;
}

function translateDebitType(balanceType: string) {
    if (balanceType in debitDict) {
        return debitDict[balanceType];
    }
    return balanceType;
}

export {translateCreditType, translateDebitType};