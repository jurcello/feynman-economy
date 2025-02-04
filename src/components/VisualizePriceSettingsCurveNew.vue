<template>
  <FormulaVisualizer :formula="priceSettingsCurve"/>
</template>

<script setup lang="ts">
import FormulaVisualizer from "@/components/FormulaVisualizer.vue";
import Formula, {VariableInformation} from "@/PlainObjects/formulaInformation";
import {ref} from "vue";

const wage = ref<number>(10);
const wageComponent: VariableInformation = {
  name: "Wage",
  reCalculator: () => {
    wage.value = (1 - sigma.value) * lambda.value * price.value;
  },
  value: wage,
  label: "Nominaal Salaris (W)",
  min: 0,
  max: 100,
  step: 0.1,
}

const price = ref<number>(10);
const priceComponent: VariableInformation = {
  name: "Price",
  reCalculator: () => {
    console.log('recalculating');
    price.value = wage.value / ((1 - sigma.value) * lambda.value);
  },
  value: price,
  label: "Profit maximizing price (P)",
  min: 0,
  max: 100,
  step: 0.1,
}

const sigma = ref<number>(0.1);
const sigmaComponent: VariableInformation = {
  name: "Sigma",
  reCalculator: () => {
    sigma.value = 1 - wage.value / (price.value * lambda.value);
  },
  value: sigma,
  label: "sigma (profit share) (σ)",
  min: 0,
  max: 1,
  step: 0.01,
}

const lambda = ref<number>(10);
const lambdaComponent: VariableInformation = {
  name: "Lambda",
  reCalculator: () => {
    lambda.value = wage.value / (price.value * (1 - sigma.value));
  },
  value: lambda,
  label: "lambda (economic parameter) (λ)",
  min: 0,
  max: 10,
  step: 0.1,
}

const components = [wageComponent, priceComponent, sigmaComponent, lambdaComponent];

const priceSettingsCurve = Formula.create(
    "priceSettingsCurve",
    "\\dfrac{W}{P} = (1 - \\sigma) \\lambda",
    components,
);
</script>

<style scoped>

</style>