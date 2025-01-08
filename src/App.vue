<template>
  <div id="app">
    <div class="container mx-auto justify-center flex">
      <div class="w-2/3">
        <div class="text-center">
          <h1>Feynman economics</h1>
          <Navigation />
        </div>
        <router-view /> <!-- Render the active route's component here -->
      </div>
    </div>
  </div>
</template>

<script>
import Navigation from "./components/Navigation.vue";

export default {
  name: 'App',
  components: {
    Navigation,
  },
};
</script>

<style>
</style>