<template>
<h2>Balance draw test using d3</h2>
  <div ref="chart"></div>
</template>

<script setup lang="ts">
import {Balance, Transaction, CreditTypes, DebitTypes, InitialBalance} from "@/balance";
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


onMounted(() => {
  const data = balance.getTotalMoneyAggregates();

  const stackedDebit = d3
      .stack()
      .keys(Object.keys(balance.debit))([balance.debit]);

  const stackedCredit = d3
      .stack()
      .keys(Object.keys(balance.credit))([balance.credit]);

  const svg = d3.select(chart.value)
      .append("svg")
      .attr("width", WIDTH)
      .attr("height", HEIGHT);

  svg.selectAll(".debit")
      .data(stackedDebit)
      .join("rect")
      .attr("class", "debit")
      .attr("fill", (d: any) => color(d.key) as string)
      .attr("x", x('debit') as number)
      .attr("y", (d: any) => y(d[0][1]))
      .attr("width", x.bandwidth())
      .attr("height", (d: any) => y(d[0][0]) - y(d[0][1]))

  svg.selectAll(".credit")
      .data(stackedCredit)
      .join("rect")
      .attr("class", "debit")
      .attr("fill", (d: any) => color(d.key) as string)
      .attr("x", x('credit') as number)
      .attr("y", (d: any) => y(d[0][1]))
      .attr("width", x.bandwidth())
      .attr("height", (d: any) => y(d[0][0]) - y(d[0][1]));


})
</script>

<style scoped>

</style>