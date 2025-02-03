<template>
  <p>Dit is de price setting curve</p>
  <div>

    <div class="slider mb-8">
      <div>Select a variable</div>
      <div>
        <select v-model="currentReactable">
          <option :value="ReactableValue.wage">Salaris</option>
          <option :value="ReactableValue.price">Profit maximizing price</option>
          <option :value="ReactableValue.sigma">sigma (profit share)</option>
          <option :value="ReactableValue.lambda">lambda (output per worker)</option>
        </select>
      </div>
      <div>
        <span>Currently selected: {{ ReactableValue[currentReactable] }}</span>
      </div>
    </div>
    <div class="slider">
      <div>Nominaal Salaris</div>
      <div>
        <input type="range" v-model="wage" min="0" max="100" step="0.1"
            :disabled="currentReactable == ReactableValue.wage"
            @change="calculateNewValues"
        />
      </div>
      <div><span>{{ wage }}</span></div>
    </div>
    <div class="slider">
      <div>Profit maximizing price</div>
      <div><input type="range" v-model="price" min="0" max="100" step="0.1"
          :disabled="currentReactable == ReactableValue.price"
          @change="calculateNewValues"
      />
      </div>
      <div><span>{{ price }}</span></div>
    </div>
    <div class="slider">
      <div>sigma (profit share)</div>
      <div><input type="range" v-model="sigma" min="0" max="1" step="0.01"
          :disabled="currentReactable == ReactableValue.sigma"
          @change="calculateNewValues"
      />
      </div>
      <div><span>{{ sigma }}</span></div>
    </div>
    <div class="slider">
      <div>lambda (output per worker)</div>
      <div><input type="range" v-model="lambda" min="0" max="10" step="0.01"
          :disabled="currentReactable == ReactableValue.lambda"
          @change="calculateNewValues"
      />
      </div>
      <div><span>{{ lambda }}</span></div>
    </div>
  </div>

</template>

<script setup lang="ts">
import {ref, onMounted} from "vue";

enum ReactableValue {
  wage,
  price,
  sigma,
  lambda,
}

const wage = ref(10);
const price = ref(10);
const sigma = ref(0.1);
const lambda = ref(10);
const currentReactable = ref(ReactableValue.wage);


const calculateNewValues = () => {
  switch (currentReactable.value) {
    case ReactableValue.wage:
      wage.value = (1 - sigma.value) * lambda.value * price.value;
      break;

    case ReactableValue.price:
      price.value = wage.value / ((1 - sigma.value) * lambda.value);
      break;

    case ReactableValue.sigma:
      sigma.value = 1 - wage.value / (price.value * lambda.value);
      break;

    case ReactableValue.lambda:
      lambda.value = wage.value / (price.value * (1 - sigma.value));
      break;

  }
}




onMounted(() => {
  calculateNewValues();
});
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