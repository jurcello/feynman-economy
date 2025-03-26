<template>
  <div ref="chart"></div>
</template>

<script setup lang="ts">
import {Balance} from "@/balance";
import * as d3 from "d3";
import {colorMappings} from "@/sketches/Animatables/BalanceDrawerExtended";
import {onMounted, ref} from "vue";
import balance from "@/views/Balance.vue";
import Colors from "@/colors";

const props = defineProps<{
  balance: Balance;
  width: number;
  height: number;
}>();

const chart = ref<HTMLElement | null>(null);

const margin = {top: 10, right: 10, bottom: 20, left: 20 };
const CHART_WIDTH = props.width;
const CHART_HEIGHT = props.height;
const WIDTH = CHART_WIDTH - margin.left - margin.right;
const HEIGHT = CHART_HEIGHT - margin.top - margin.bottom;

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

                return height > 25? `${d.key}: € ${d[0].data[d.key]}`: ""
              })
              .attr("text-anchor", "middle")
              .attr("alignment-baseline", "hanging")
              .attr("fill", (d: any) => color(d.key) == Colors.white ? "black" : "white")
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
                  return height > 25 ? `${d.key}: € ${d[0].data[d.key]}`: ""
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

onMounted(() => {

  const svg = d3.select(chart.value)
      .append("svg")
      .attr("width", CHART_WIDTH)
      .attr("height", CHART_HEIGHT)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`) as d3.Selection<SVGGElement, unknown, null | HTMLElement, any>;

  const redraw = () => {
    const stackedDebit = d3
        .stack()
        .keys(Object.keys(props.balance.debit))([props.balance.debit]);

    const stackedCredit = d3
        .stack()
        .keys(Object.keys(props.balance.credit))([props.balance.credit]);


    const currentDomainY = y.domain()[1];
    if (props.balance.getTotalMoneyAggregates().total > currentDomainY) {
      y.domain([0, props.balance.getTotalMoneyAggregates().total * 1.5]);
    }
    drawBalances(svg, "debit", stackedDebit);
    drawBalances(svg, "credit", stackedCredit);
  }

  redraw();

  props.balance.registerBalanceStatusCallback((status) => {
    console.log('Balance status updated:', status.inBalance);
    redraw();
  })


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