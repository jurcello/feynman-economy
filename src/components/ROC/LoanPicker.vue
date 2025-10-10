<template>
  <div class="max-w-5xl mx-auto">
    <h2>Loanpicker</h2>
    <div class="flex gap-4">
      <div class="investments-container w-2/3">
        <h3>Available Investments</h3>
        <Investment
            v-for="(loan, index) in loans"
            :key="loan.id"
            :amount="loan.amount"
            :roc="loan.roc"
            :var-risk="loan.varRisk"
            :ton-c-o2="loan.tonCO2"
            :description="loan.description"
            :draggable="true"
            @dragstart="handleDragStart($event, index)"
            @dragend="handleDragEnd"
        />
      </div>
      <div 
        class="investment-destination w-1/3 min-h-96 border-2 border-dashed border-gray-300 rounded-lg p-4"
        :class="{ 'border-blue-500 bg-blue-50': isDragOver }"
        @dragover="handleDragOver"
        @dragenter="handleDragEnter"
        @dragleave="handleDragLeave"
        @drop="handleDrop"
      >
        <h3>Investment Destination</h3>
        <div v-if="selectedInvestments.length === 0" class="text-gray-500 text-center mt-8">
          Drag investments here
        </div>
        <div v-else class="mt-4">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Investment from "@/components/ROC/SubComponents/Investment.vue";
import {reactive, ref} from "vue";

interface LoanData {
  
  id: number
  amount: number
  roc: number
  varRisk: number
  tonCO2: number
  description: string
}

const loans = reactive<LoanData[]>([
  {
    id: 1,
    amount: 20000000,
    roc: 4.6,
    varRisk: 7000,
    tonCO2: 50,
    description: "Solar panel installation project"
  },
  {
    id: 2,
    amount: 15000000,
    roc: 3.8,
    varRisk: 5500,
    tonCO2: 40,
    description: "Wind farm development"
  },
  {
    id: 3,
    amount: 25000000,
    roc: 5.2,
    varRisk: 8500,
    tonCO2: 60,
    description: "Industrial energy efficiency upgrade"
  },
  {
    id: 4,
    amount: 18000000,
    roc: 4.2,
    varRisk: 6200,
    tonCO2: 45,
    description: "Sustainable transportation fleet"
  },
  {
    id: 5,
    amount: 22000000,
    roc: 4.8,
    varRisk: 7500,
    tonCO2: 55,
    description: "Green building construction"
  }
])

const selectedInvestments = reactive<LoanData[]>([])
const isDragOver = ref(false)
let draggedItemIndex: number | null = null

// Drag event handlers
const handleDragStart = (event: DragEvent, index: number) => {
  draggedItemIndex = index
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', index.toString())
  }
}

const handleDragEnd = () => {
  draggedItemIndex = null
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault() // This allows the drop
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

const handleDragEnter = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = (event: DragEvent) => {
  // Only hide drag over state if we're actually leaving the drop zone
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  if (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  ) {
    isDragOver.value = false
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false
  
  if (event.dataTransfer && draggedItemIndex !== null) {
    const draggedItem = loans[draggedItemIndex]
    
    // Check if item is already in selected investments
    const isAlreadySelected = selectedInvestments.some(
        investment => investment.id === draggedItem.id
    )
    
    if (!isAlreadySelected) {
      selectedInvestments.push({ ...draggedItem })
      console.log(selectedInvestments)
      // Optionally remove from available loans
      // loans.splice(draggedItemIndex, 1)
    }
  }
  
  draggedItemIndex = null
}
</script>

<style scoped>
</style>
