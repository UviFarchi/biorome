<template>
  <div class="grid">
    <div
      v-for="tile in tiles"
      :key="`${tile.row}-${tile.col}`"
      class="tile"
      @click="openTile(tile)"
    >
      <div class="plant" v-if="tile.plant">
        {{ tile.plant.type }} ({{ tile.plant.growthStage }})
      </div>
      <div class="animal" v-if="tile.animal">
        {{ tile.animal.type }}
      </div>
      <div class="soil">
        <div
          class="soil-health"
          :style="{ backgroundColor: soilColor(tile.soil.health.current) }"
        >
          {{ tile.soil.health.current }}
        </div>
      </div>
    </div>
  </div>

  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <button class="close" @click="closeModal">X</button>
      <h3>Tile ({{ selectedTile.row }}, {{ selectedTile.col }})</h3>
      <p>Plant: {{ selectedTile.plant ? `${selectedTile.plant.type} - ${selectedTile.plant.growthStage}` : 'None' }}</p>
      <p>Animal: {{ selectedTile.animal ? selectedTile.animal.type : 'None' }}</p>
      <p>Soil fertility: {{ selectedTile.soil.fertility }}</p>
      <p>Soil health: {{ selectedTile.soil.health.current }} / {{ selectedTile.soil.health.max }}</p>
      <button @click="deployExample">Deploy Fertilizer</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useBoardStore } from '../stores/board'
import { useModulesStore } from '../stores/modules'

const board = useBoardStore()
const modules = useModulesStore()

const tiles = board.tiles

const showModal = ref(false)
const selectedTile = ref({})

function openTile(tile) {
  selectedTile.value = tile
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function soilColor(value) {
  if (value > 75) return '#7CFC00'
  if (value > 50) return '#ADFF2F'
  if (value > 25) return '#FFD700'
  return '#FF4500'
}

function deployExample() {
  const tile = selectedTile.value
  const assembly = modules.assemble(['Fertilizer'])
  modules.deploy(tile.row, tile.col, assembly)
  closeModal()
}
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 4px;
}

.tile {
  border: 1px solid #ccc;
  padding: 4px;
  cursor: pointer;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.soil-health {
  height: 8px;
  width: 100%;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 1rem;
  max-width: 300px;
  width: 100%;
}

.close {
  float: right;
}
</style>
