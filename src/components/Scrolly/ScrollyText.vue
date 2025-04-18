<template>
  <div :class="['scrolly-text-item', customClass]" :id="id">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps({
  id: {
    type: String,
    required: true
  },
  customClass: {
    type: String,
    default: ''
  }
});
</script>

<style scoped>
</style>