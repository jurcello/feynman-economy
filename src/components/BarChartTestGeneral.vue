<template>
  <h1>Bar chart test</h1>
  <div ref="chart"></div>
</template>

<script setup lang="ts">
import {ref, onMounted} from "vue";
import * as d3 from "d3";

const chart = ref<HTMLDivElement | null>(null);

const data = [
  { label: "Activa", value: 7 },
  { label: "Passiva", value: 15 },
]

onMounted(() => {
  const margin = { top: 10, right: 10, bottom: 20, left: 20 };
  const chartWidth = 500;
  const chartHeight = 500;
  const width = chartWidth - margin.left - margin.right;
  const height = chartHeight - margin.top - margin.bottom;

  const svg = d3.select(chart.value)
      .append("svg")
      .classed("barchart", true)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  const x = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, width])
      .padding(0.2);
  const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .nice()
      .range([height, 0]);

  svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.label) || 0)
      .attr("y", d => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.value))
      .attr("fill", "steelblue");

  svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .call(g => g.select(".domain").remove());



})
</script>

<style>
.barchart {
  width: 500px;
  height: 500px;
}
</style>