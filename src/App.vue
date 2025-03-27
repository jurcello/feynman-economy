<template>
  <div id="app">
    <div class="container mx-auto justify-center flex">
      <div class="w-4/5">
        <div class="header">
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

<style scoped>
.header {
  @apply text-center sticky top-0 mb-6 bg-white border-b border-black z-10 pb-4;
  height: 100px;
}
</style>