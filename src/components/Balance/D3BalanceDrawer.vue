<template>
  <div ref="chart" class="bg-white"></div>
</template>

<script setup lang="ts">
import {Balance, DebitTypes, CreditTypes} from "@/balance";
import * as d3 from "d3";
import colorMappings from "@/balanceColorMappings";
import {onMounted, ref, watch} from "vue";
import {getTextColorWCAG} from "@/utils/color";
import {translateCreditType, translateDebitType} from "@/utils/balanceTypeTranslations";

const defaultDebitOrder: DebitTypes[] = [
  DebitTypes.cash,
  DebitTypes.backAccount,
  DebitTypes.property,
  DebitTypes.loan,
  DebitTypes.noneMoney,
  DebitTypes.nonMoneyHouse,
  DebitTypes.reserves,
  DebitTypes.currency,
  DebitTypes.deposits,
  DebitTypes.newDeposits,
  DebitTypes.newLoans,
  DebitTypes.none,
  DebitTypes.mlPossessions,
  DebitTypes.mlCentralGold,
  DebitTypes.mlCentralForeignCurrencies,
  DebitTypes.mlCentralBonds,
  DebitTypes.mlCentralLoansToBanks,
  DebitTypes.mlCorporateDigitalPublicMoney,
  DebitTypes.mlCorporatePhysicalPublicMoney,
  DebitTypes.mlCorporateBonds,
  DebitTypes.mlCorporateLoansToBanks,
  DebitTypes.mlCorporateLoansToNonBanks
];
const defaultCreditOrder: CreditTypes[] = [
  CreditTypes.equity,
  CreditTypes.debt,
  CreditTypes.creditAccount,
  CreditTypes.savingsAccount,
  CreditTypes.reserves,
  CreditTypes.currency,
  CreditTypes.deposits,
  CreditTypes.newDeposits,
  CreditTypes.newLoans,
  CreditTypes.noneMoney,
  CreditTypes.none,
  CreditTypes.mlObligations,
  CreditTypes.mlEquities,
  CreditTypes.mlCentralDigitalPublicMoney,
  CreditTypes.mlCentralPhysicalPublicMoneyInCirculation,
  CreditTypes.mlCentralCapital,
  CreditTypes.mlCorporateInsuredPrivateMoney,
  CreditTypes.mlCorporateUninsuredPrivateMoney,
  CreditTypes.mlCorporateLoansFromBanks,
  CreditTypes.mlCorporateLongTermDepths,
  CreditTypes.mlCorporateCapital
];

const props = withDefaults(
    defineProps<{
      balance: Balance;
      width: number;
      height: number;
      maxY?: number | null,
      showAmounts?: boolean,
      debitDescription?: string | null,
      creditDescription?: string | null,
      debitOrder?: DebitTypes[] | null,
      creditOrder?: string[] | null,
    }>(), {
      showAmounts: true,
    });

const chart = ref<HTMLElement | null>(null);

const margin = {top: 40, right: 0, bottom: 30, left: 0 };
const CHART_WIDTH = props.width;
const CHART_HEIGHT = props.height;
const WIDTH = CHART_WIDTH - margin.left - margin.right;
const HEIGHT = CHART_HEIGHT - margin.top - margin.bottom;

const x = d3.scaleBand()
    .domain(['debit', 'credit'])
    .range([0, WIDTH])
    .padding(0.05);

const y = d3.scaleLinear()
    .domain([0, Number(props.maxY) || props.balance.getTotalMoneyAggregates().total * 1.5])
    .nice()
    .range([HEIGHT, 0]);

const color = d3.scaleOrdinal()
    .domain(Object.keys(colorMappings))
    .range(Object.values(colorMappings));

const createBalanceText = (description: string, amount: number) => {
  return props.showAmounts ? `${description}: € ${amount}` : description
};

function drawBalances(svg: d3.Selection<SVGGElement, unknown, null | HTMLElement, any>, balanceType: string, stackedData: d3.Series<{
  [p: string]: number
}, string>[]) {

  const t = balanceType === 'debit' ? translateDebitType : translateCreditType;
  
  svg.selectAll(`.${balanceType}`)
      .data(stackedData)
      .join(
          enter => {
            const enterData = enter.data();
            const startY = enterData.length > 0 ? enterData[0][0][0] : 0;
            return enter
                .append("rect")
                .attr("class", balanceType)
                .attr("fill", (d: any) => color(d.key) as string)
                .attr("x", x(balanceType) as number)
                .attr("stroke", "black")
                .attr("width", x.bandwidth())
                // Start with height 0 at the bottom for the entrance animation
                .attr("y", (d: any) => {
                  return y(startY);
                })

                .attr("height", 0)
                // Then transition to the actual values
                .call(enter => enter.transition()
                    .duration(750)
                    .attr("y", (d: any) => y(d[0][1]))
                    .attr("height", (d: any) => y(d[0][0]) - y(d[0][1]))
                )
          },
          update => update
              // For existing elements, animate to their new positions/heights
              .call(update => update.transition()
                  .duration(750)
                  .attr("y", (d: any) => y(d[0][1]))
                  .attr("height", (d: any) => y(d[0][0]) - y(d[0][1]))
                  .attr("fill", (d: any) => color(d.key) as string)
              ),
          exit => exit
              // Animate the exit by shrinking height to 0
              .call(exit => exit.transition()
                  .duration(750)
                  .attr("y", (d: any) => y(0))
                  .attr("height", 0)
                  .remove()
              )
      )

  svg.selectAll(`.${balanceType}-label`)
      .data(stackedData)
      .join(
          enter => enter
              .append("text")
              .attr("class", `${balanceType}-label`)
              .attr("x", x(balanceType) as number + x.bandwidth() / 2)
              .attr("y", (d: any) => y(d[0][0]) - 10)
              .text((d: any) => {
                const height = y(d[0][0]) - y(d[0][1]);

                return height > 25? createBalanceText(t(d.key), d[0].data[d.key]) : "";
              })
              .attr("text-anchor", "middle")
              .attr("alignment-baseline", "hanging")
              .attr("fill", (d: any) => getTextColorWCAG(color(d.key) as string))
              .attr("font-size", "12px")
              .attr("opacity", "0")
              .call(enter => enter.transition()
                  .duration(750)
                  .delay((d,i) => i*50 + 150)
                  .attr("opacity", "1")
                  .attr("y", (d: any) => y(d[0][0]) - 10)
              ),
          update => update.text((d: any) => {
                  const height = y(d[0][0]) - y(d[0][1]);
                  return height > 25 ? createBalanceText(t(d.key), d[0].data[d.key]) : "";
                })
              .call(update => update.transition()
                  .duration(750)
                  .attr("y", (d: any) => (y(d[0][0]) - 10))
                  .attr("opacity", (d: any) => {
                    const height = y(d[0][0]) - y(d[0][1]);
                    return height > 25 ? 1 : 0;
                  })
              ),
          exit => exit
              .call(exit => exit.transition()
                  .duration(750)
                  .attr("opacity", 0)
                  .remove()
              )
      )

}
let redraw: () => void;

watch(() => props.debitDescription, (newValue, oldValue) => {
  redraw();
});
watch(() => props.creditDescription, (newValue, oldValue) => {
  redraw();
});

onMounted(() => {
  const debitOrder = props.debitOrder ?? defaultDebitOrder;
  const creditOrder = props.creditOrder ?? defaultCreditOrder;

  const svg = d3.select(chart.value)
      .append("svg")
      .attr("width", CHART_WIDTH)
      .attr("height", CHART_HEIGHT)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`) as d3.Selection<SVGGElement, unknown, null | HTMLElement, any>;

  svg.append("g")
      .selectAll("text.title")
      .data([props.balance.name])
      .join("text")
      .attr("class", "title")
      .text(d => d)
      .attr("x", WIDTH / 2)
      .attr("y", -15)
      .attr("text-anchor", "middle")

  redraw = () => {
    const bottomLabels = [
      {
        type: 'debit',
        label: props.debitDescription ?? 'Debit / Bezittingen',
      },
      {
        type: 'credit',
        label: props.creditDescription ?? 'Credit / Verplichtingen',
      }
    ]

    const debitKeys = Object.keys(props.balance.debit);
    const stackedDebit = d3
        .stack()
        .keys(debitKeys)
        .order((series) => {
          const seriesIndices = series.map((_, i) => i);
          const sorted = seriesIndices.sort((a, b) => {
            const keyA = series[a].key;
            const keyB = series[b].key;
            const indexA = debitOrder.indexOf(keyA as DebitTypes);
            const indexB = debitOrder.indexOf(keyB as DebitTypes);

            // If not found in order array, put at end
            const orderA = indexA === -1 ? Infinity : indexA;
            const orderB = indexB === -1 ? Infinity : indexB;

            return orderA - orderB;
          });
          return sorted.reverse();
        })([props.balance.debit]);

    const creditKeys = Object.keys(props.balance.credit);
    const stackedCredit = d3
        .stack()
        .keys(creditKeys)
        .order((series) => {
          const seriesIndices = series.map((_, i) => i);
          const sorted = seriesIndices.sort((a, b) => {
            const keyA = series[a].key;
            const keyB = series[b].key;
            const indexA = creditOrder.indexOf(keyA as CreditTypes);
            const indexB = creditOrder.indexOf(keyB as CreditTypes);

            // If not found in order array, put at end
            const orderA = indexA === -1 ? Infinity : indexA;
            const orderB = indexB === -1 ? Infinity : indexB;

            return orderA - orderB;
          });
          return sorted.reverse();
        })
        ([props.balance.credit]);


    const currentDomainY = y.domain()[1];
    if (props.balance.getTotalMoneyAggregates().total > currentDomainY) {
      y.domain([0, props.balance.getTotalMoneyAggregates().total * 1.5]);
    }
    drawBalances(svg, "debit", stackedDebit);
    drawBalances(svg, "credit", stackedCredit);

    let bottomLabelGroup = svg.select<SVGGElement>(".bottom-label-group");
    if (bottomLabelGroup.empty()) {
      bottomLabelGroup = svg.append("g")
          .attr("class", "bottom-label-group")
          .attr("transform", `translate(0, ${HEIGHT})`);
    }

    bottomLabelGroup
        .selectAll(".bottom-label")
        .data(bottomLabels)
        .join("text")
        .text((d: any) => d.label)
        .attr("class", "bottom-label")
        .attr("x", (d: any) => x(d.type) as number + x.bandwidth() / 2)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
  }

  redraw();

  props.balance.registerBalanceStatusCallback((status) => {
    console.log('Balance status updated:', status.inBalance);
    redraw();
  })
})
</script>

<style>
text.title {
  font-size: 20px;
  font-weight: bold;
}
</style>