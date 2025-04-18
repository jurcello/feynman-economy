<template>
  <div :class="['sheet', customClass]" :id="id">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps({
  id: {
    type: String,
  },
  customClass: {
    type: String,
    default: ''
  }
});
</script>

<style scoped>
</style>