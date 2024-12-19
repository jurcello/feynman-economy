<template>
  <div id="app">
    <h1>Welcome to Vue 3 with Vite!</h1>
    <P5Sketch />
  </div>
</template>

<script>
import P5Sketch from './components/P5Sketch.vue';

export default {
  name: 'App',
  components: {
    P5Sketch,
  },
};

</script>

<style>
/* Optional styles for your app */
#app {
  text-align: center;
  margin: 1em;
}
</style>