<template>
  <h1>private equity explanation</h1>
  <button
      @click="executeTimelines"
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
  >
    Start sequence
  </button>
  <button
      @click="reset"
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
  >
    Reset
  </button>
  <div class="visualisations">
    <div class="left">
      <PEPreLBO
          ref="preLBO"
      />
    </div>
    <div class="right">
      <PEPostLBO
          ref="postLBO"
      />
    </div>
  </div>


</template>

<script setup lang="ts">
import PEPreLBO from "@/components/Explanations/PrivateEquity/PEPreLBO.vue";
import PEPostLBO from "@/components/Explanations/PrivateEquity/PEPostLBO.vue";
import {ref} from "vue";

const preLBO = ref<InstanceType<typeof PEPreLBO>>();
const postLBO = ref<InstanceType<typeof PEPostLBO>>();

const executeTimelines = () => {
  preLBO.value?.executeTimeline();
  postLBO.value?.executeTimeline();
}

const reset = () => {
  preLBO.value?.reset();
  postLBO.value?.reset();
}
</script>

<style scoped>
.visualisations {
  display: flex;
}
</style>