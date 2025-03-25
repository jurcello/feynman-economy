<template>
<h2>Balance draw test using d3</h2>
  <div ref="chart"></div>
</template>

<script setup lang="ts">
import {Balance, CreditTypes, DebitTypes, InitialBalance} from "@/balance";
import {onMounted, ref} from "vue";
import * as d3 from "d3"
import {colorMappings} from "@/sketches/Animatables/BalanceDrawerExtended";

const initialBalance: InitialBalance = {
  debit: [
    { type: DebitTypes.currency, amount: 100 },
    { type: DebitTypes.deposits, amount: 50 },
    { type: DebitTypes.property, amount: 100 },
  ],
  credit: [
    { type: CreditTypes.equity, amount: 200 },
    { type: CreditTypes.debt, amount: 50 },
  ]
};

const balance = Balance.createFromInitialBalance('Barbie', initialBalance);

const chart = ref<HTMLElement | null>(null);

const WIDTH = 400;
const HEIGHT = 300;

const x = d3.scaleBand()
    .domain(Object.keys(initialBalance))
    .range([0, WIDTH])
    .padding(0.1);

const y = d3.scaleLinear()
    .domain([0, balance.getTotalMoneyAggregates().total * 1.5])
    .nice()
    .range([HEIGHT, 0]);

const color = d3.scaleOrdinal()
    .domain(Object.keys(colorMappings))
    .range(Object.values(colorMappings));


function drawBalances(svg: d3.Selection<SVGSVGElement, unknown, null | HTMLElement, any>, balanceType: string, stackedData: d3.Series<{
  [p: string]: number
}, string>[]) {
  svg.selectAll(`.${balanceType}`)
      .data(stackedData)
      .join("rect")
      .attr("class", balanceType)
      .attr("fill", (d: any) => color(d.key) as string)
      .attr("x", x(balanceType) as number)
      .attr("y", (d: any) => y(d[0][1]))
      .attr("width", x.bandwidth())
      .attr("height", (d: any) => y(d[0][0]) - y(d[0][1]))

  svg.selectAll(`.${balanceType}-label`)
      .data(stackedData)
      .join("text")
      .attr("class", `${balanceType}-label`)
      .attr("x", x(balanceType) as number + x.bandwidth() / 2)
      .attr("y", (d: any) => y(d[0][0]) - 10)
      .text((d: any) => `${d.key}: € ${d[0].data[d.key]}`)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "hanging")
      .attr("fill", "white")
      .attr("font-size", "12px")
}

onMounted(() => {
  const stackedDebit = d3
      .stack()
      .keys(Object.keys(balance.debit))([balance.debit]);

  const stackedCredit = d3
      .stack()
      .keys(Object.keys(balance.credit))([balance.credit]);

  const svg = d3.select(chart.value)
      .append("svg")
      .attr("width", WIDTH)
      .attr("height", HEIGHT) as d3.Selection<SVGSVGElement, unknown, null | HTMLElement, any>;

  drawBalances(svg, "debit", stackedDebit);
  drawBalances(svg, "credit", stackedCredit);

})
</script>

<style scoped>

</style>