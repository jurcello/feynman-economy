<template>

</template>

<script setup lang="ts">
import {Balance} from "@/balance";

const centralBank = new Balance("Centrale Bank");
const commercialBank = new Balance("Commerciële Bank");
const personalBalance = new Balance("Persoonlijke Balans");
</script>

<style scoped>

</style>