<template>
  <Sheet id="introduction" custom-class="flex flex-col justify-around">
    <h1>{{title}}</h1>
    <ExplanationItem>
      <slot></slot>
    </ExplanationItem>
    <div>
      <CircleArrow></CircleArrow>
    </div>
  </Sheet>
</template>

<script setup lang="ts">
import CircleArrow from "@/components/Svg/CircleArrow.vue";
import Sheet from "@/components/Scrolly/Sheet.vue";
import ExplanationItem from "@/components/Scrolly/ExplanationItem.vue";

defineProps({
  id: {
    type: String,
  },
  title: {
    type: String,
  }
});

</script>

<style scoped>

</style>