import {CreditTypes, DebitTypes} from "@/balance";

const creditDict = {
}

const debitDict: {[key: string]: string} = {
    [DebitTypes.mlCentralForeignCurrencies]: "Foreign Currencies",
    [DebitTypes.mlCentralBonds]: "Bonds",
    [DebitTypes.mlCentralLoansToBanks]: "Loans to Banks",
}

function translateCreditType(creditType: string) {
    return creditType;
}

function translateDebitType(balanceType: string) {
    if (balanceType in debitDict) {
        return debitDict[balanceType];
    }
    return balanceType;
}

export {translateCreditType, translateDebitType};