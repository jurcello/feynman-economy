<template>
  <div class="money-flow-container">
    <p class="mb-4">This component demonstrates the flow of money between three destinations.</p>
    
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { MoneyDestination, MoneyDestinationConfig, MoneyBlock } from '@/utils/moneySquareUtils';

// Create three money destinations with different configurations
const moneyDestinations = ref<MoneyDestination[]>([]);

// Initialize money destinations
onMounted(() => {
  // Create configurations for each destination with different positions
  const config1 = new MoneyDestinationConfig({
    blockSize: 10,
    blocksPerRow: 5,
    blockGutter: 2,
    position: { x: 20, y: 180 }
  });
  
  const config2 = new MoneyDestinationConfig({
    blockSize: 10,
    blocksPerRow: 5,
    blockGutter: 2,
    position: { x: 80, y: 180 }
  });
  
  const config3 = new MoneyDestinationConfig({
    blockSize: 10,
    blocksPerRow: 5,
    blockGutter: 2,
    position: { x: 140, y: 180 }
  });
  
  // Create money destinations with initial amounts
  moneyDestinations.value = [
    new MoneyDestination('Source', 20, config1),
    new MoneyDestination('Intermediate', 10, config2),
    new MoneyDestination('Target', 5, config3)
  ];
  
});

// Clean up animation frame on component unmount
</script>

<style scoped>
.money-flow-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.money-destinations {
  display: flex;
  justify-content: space-between;
}

.money-destination {
  text-align: center;
}

.money-blocks-container {
  background-color: #f5f5f5;
}
</style>