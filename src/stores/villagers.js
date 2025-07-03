import { defineStore } from 'pinia'
import { ref } from 'vue'

// Example products with weights used for generating requests
const defaultProducts = [
  { name: 'Corn', weight: 3 },
  { name: 'Milk', weight: 1 },
  { name: 'Eggs', weight: 2 }
]

function weightedRandom(items) {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0)
  let r = Math.random() * totalWeight
  for (const item of items) {
    if ((r -= item.weight) < 0) {
      return item.name
    }
  }
  return items[0].name
}

export const useVillagerStore = defineStore('villagers', () => {
  const activeVillagers = ref([])
  const score = ref(0)
  let villagerId = 0

  function generateRequests(products, count) {
    const requests = []
    for (let i = 0; i < count; i++) {
      requests.push(weightedRandom(products))
    }
    return requests
  }

  function generateNewVillagers({
    count = 3,
    products = defaultProducts,
    timerRange = [3, 5]
  } = {}) {
    for (let i = 0; i < count; i++) {
      const timer = Math.floor(
        Math.random() * (timerRange[1] - timerRange[0] + 1)
      ) + timerRange[0]
      activeVillagers.value.push({
        id: villagerId++,
        requestedItems: generateRequests(products, Math.floor(Math.random() * 3) + 1),
        timer
      })
    }
  }

  function fulfillVillager(id) {
    const index = activeVillagers.value.findIndex(v => v.id === id)
    if (index !== -1) {
      activeVillagers.value.splice(index, 1)
      score.value += 10
    }
  }

  function decrementTimers(onFail) {
    for (let i = activeVillagers.value.length - 1; i >= 0; i--) {
      const villager = activeVillagers.value[i]
      villager.timer -= 1
      if (villager.timer <= 0) {
        if (onFail) onFail(villager)
        score.value -= 5
        activeVillagers.value.splice(i, 1)
      }
    }
  }

  function reset() {
    activeVillagers.value = []
    score.value = 0
    villagerId = 0
  }

  return {
    activeVillagers,
    score,
    generateNewVillagers,
    fulfillVillager,
    decrementTimers,
    reset
  }
})
