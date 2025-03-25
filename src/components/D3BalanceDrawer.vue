<template>
  <div ref="chart"></div>
</template>

<script setup lang="ts">
import {Balance} from "@/balance";
import * as d3 from "d3";
import {colorMappings} from "@/sketches/Animatables/BalanceDrawerExtended";
import {onMounted, ref} from "vue";

const props = defineProps<{
  balance: Balance;
  width: number;
  height: number;
}>();

const chart = ref<HTMLElement | null>(null);

const margin = {top: 10, right: 10, bottom: 20, left: 20 };
const CHART_WIDTH = props.width;
const CHART_HEIGHT = props.height;
const WIDTH = 400 - margin.left - margin.right;
const HEIGHT = 300 - margin.top - margin.bottom;

const x = d3.scaleBand()
    .domain(['debit', 'credit'])
    .range([0, WIDTH])
    .padding(0.1);

const y = d3.scaleLinear()
    .domain([0, props.balance.getTotalMoneyAggregates().total * 1.5])
    .nice()
    .range([HEIGHT, 0]);

const color = d3.scaleOrdinal()
    .domain(Object.keys(colorMappings))
    .range(Object.values(colorMappings));


function drawBalances(svg: d3.Selection<SVGGElement, unknown, null | HTMLElement, any>, balanceType: string, stackedData: d3.Series<{
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
      .keys(Object.keys(props.balance.debit))([props.balance.debit]);

  const stackedCredit = d3
      .stack()
      .keys(Object.keys(props.balance.credit))([props.balance.credit]);

  const svg = d3.select(chart.value)
      .append("svg")
      .attr("width", CHART_WIDTH)
      .attr("height", CHART_HEIGHT)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`) as d3.Selection<SVGGElement, unknown, null | HTMLElement, any>;

  drawBalances(svg, "debit", stackedDebit);
  drawBalances(svg, "credit", stackedCredit);

  const bottomLabels = [
    {
      type: 'debit',
      label: 'Debit / Bezittingen',
    },
    {
      type: 'credit',
      label: 'Credit / Verplichtingen',
    }
  ]
  svg.append("g")
      .attr("transform", `translate(0, ${HEIGHT})`)
      .selectAll(".bottom-label")
      .data(bottomLabels)
      .join("text")
      .text((d: any) => d.label)
      .attr("class", "bottom-label")
      .attr("x", (d: any) => x(d.type) as number + x.bandwidth() / 2)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
})
</script>

<style scoped>

</style>