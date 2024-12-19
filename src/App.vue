<template>
  <div id="app">
    <h1>Feynman economics</h1>
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/balans">Balans</router-link>
    </nav>
    <router-view /> <!-- Render the active route's component here -->
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
/* Optional styles for your app */
#app {
  text-align: center;
  margin: 1em;
}
</style>