<template>
  <div v-if="visible" class="overlay">
    <div class="panel">
      <h2>{{ game.win ? 'You Win!' : 'Game Over' }}</h2>
      <p>Final Score: {{ finalScore }}</p>
      <p>Villagers Served: {{ villagersServed }}</p>
      <p>Turns Survived: {{ game.turn }}</p>
      <p>Average Soil Health: {{ averageSoilHealth }}</p>
      <button @click="restart">Restart Game</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useGameStateStore } from '../stores/game'
import { useVillagerStore } from '../stores/villagers'
import { useBoardStore } from '../stores/board'

const game = useGameStateStore()
const villagers = useVillagerStore()
const board = useBoardStore()

const visible = ref(false)

watch(
  () => game.gameOver,
  val => {
    if (val) {
      visible.value = true
    }
  }
)

const finalScore = computed(() => game.score)
const villagersServed = computed(() => Math.max(0, Math.floor(villagers.score / 10)))

const averageSoilHealth = computed(() => {
  const tiles = board.tiles
  if (!tiles.length) return 0
  const total = tiles.reduce((sum, t) => sum + t.soil.health.current, 0)
  return Math.round(total / tiles.length)
})

function restart() {
  game.resetGame()
  visible.value = false
}
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.panel {
  background: white;
  padding: 1rem 1.5rem;
  max-width: 320px;
  width: 100%;
  text-align: center;
}
</style>
