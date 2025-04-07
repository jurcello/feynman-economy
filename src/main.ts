import { createApp } from 'vue';
import App from './App.vue';
import './plugins/gsap';
import './assets/styles/style.css';
import router from './router'; // Import the router

const app = createApp(App);

app.use(router); // Register the router in the Vue app
app.mount('#app');