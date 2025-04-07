<template>
  <svg :width="size" :height="size" viewBox="0 0 100 100" class="bouncing">
    <!-- Circle -->
    <circle
        cx="50"
        cy="50"
        r="40"
        stroke="#333"
        stroke-width="2"
        fill="none"
    />

    <!-- Downward Arrow -->
    <path
        d="M 50,30 L 50,70 L 40,60 M 50,70 L 60,60"
        stroke="#333"
        stroke-width="2.5"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
    />
  </svg>
</template>

<script setup lang="ts">
import {gsap} from "gsap";
import {onMounted} from "vue";

defineProps({
  size: {
    type: Number,
    default: 100
  }
});

onMounted(() => {
  gsap.to('.bouncing', {
    transform: "translateY(25px)",
    repeat: -1,
    duration: 1,
    yoyo: true,
    ease: "sine",
  });
})

</script>