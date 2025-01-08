import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';
import Balance from "../views/Balance.vue";
import MoneyMultiplier from "../views/MoneyMultiplier.vue";

// Define routes for your app
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home, // The component to render for this route
  },
  {
    path: '/about',
    name: 'About',
    component: About, // The component for the About page
  },
  {
    path: '/balans',
    name: 'Balance',
    component: Balance, // The component for the About page
  },

  {
    path: '/money-multiplier',
    name: 'MoneyMultiplier',
    component: MoneyMultiplier,
  },
];

// Create router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // Use HTML5 history mode
  routes,
});

export default router;