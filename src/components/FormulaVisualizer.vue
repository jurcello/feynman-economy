<template>
  <h2>{{ formula.name }}</h2>
  <div ref="formulaDiv"></div>
  <div class="slider mb-8">
    <div>Select a variable</div>
    <div>
      <select v-model="formula.currentReactable">
        <option v-for="component in formula.getComponents()" :value="component.name">{{ component.label}}</option>
      </select>
    </div>
    <div>
      <span>Currently selected: {{ formula.currentReactable }}</span>
    </div>
  </div>
  <div class="slider" v-for="component in formula.getComponents()">
    <div>{{ component.label }}</div>
    <div>
      <input type="range" v-model="component.value" :min="component.min" :max="component.max" :step="component.step"
          :disabled="formula.currentReactable == component.name"
          @change="formula.calculateNewValues"
      />
    </div>
    <div><span>{{ component.value }}</span></div>

  </div>

</template>

<script setup lang="ts">
import Formula from "@/PlainObjects/formulaInformation";
import {ref, onMounted, PropType} from "vue";
import katex from "katex";

const { formula } = defineProps({
  formula: {
    type: Object as PropType<Formula>,
    required: true,
  }
})

const formulaDiv = ref<HTMLDivElement>();

onMounted(() => {
  formula.calculateNewValues();
  katex.render(formula.formulaInTex, formulaDiv.value!);
})
</script>

<style scoped>
.slider {
  display: flex;

  & div {
    @apply mx-4;

    &:first-child {
      @apply ml-0;
    }
  }
}
</style>