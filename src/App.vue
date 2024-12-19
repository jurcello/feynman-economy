<template>
  <div id="app">
    <div class="container mx-auto justify-center flex">
      <div class="w-2/3">
        <div class="text-center">
          <h1>Feynman economics</h1>
          <nav>
            <router-link to="/">Home</router-link>
            |
            <router-link to="/about">About</router-link>
            |
            <router-link to="/balans">Balans</router-link>
          </nav>
        </div>
        <router-view /> <!-- Render the active route's component here -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
</style>