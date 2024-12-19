<template>
  <div>
    <h1>De balans</h1>
    <BalanceExplanationSketch />
  </div>
</template>

<script>
import BalanceExplanationSketch from "../components/BalanceExplanationSketch.vue";

export default {
  name: 'Balance',
  components: {BalanceExplanationSketch},
};
</script>