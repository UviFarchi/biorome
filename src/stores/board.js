import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Plant from '../models/Plant'
import Animal from '../models/Animal'
import Soil from '../models/Soil'

export const useBoardStore = defineStore('board', () => {
  const size = 6

  function createBoard() {
    return Array.from({ length: size }, (_, row) =>
      Array.from({ length: size }, (_, col) => ({
        row,
        col,
        plant: null,
        animal: null,
        soil: new Soil()
      }))
    )
  }

  const board = ref(createBoard())

  const tiles = computed(() => board.value.flat())

  function getTile(row, col) {
    return board.value[row] && board.value[row][col] ? board.value[row][col] : null
  }

  const plants = computed(() =>
    tiles.value.map(t => t.plant).filter(p => p)
  )

  const animals = computed(() =>
    tiles.value.map(t => t.animal).filter(a => a)
  )

  function setPlant(row, col, plant) {
    const tile = getTile(row, col)
    if (tile) tile.plant = plant
  }

  function removePlant(row, col) {
    const tile = getTile(row, col)
    if (tile) tile.plant = null
  }

  function setAnimal(row, col, animal) {
    const tile = getTile(row, col)
    if (tile) tile.animal = animal
  }

  function removeAnimal(row, col) {
    const tile = getTile(row, col)
    if (tile) tile.animal = null
  }

  function resetBoard() {
    board.value = createBoard()
  }

  return {
    size,
    board,
    tiles,
    getTile,
    plants,
    animals,
    setPlant,
    removePlant,
    setAnimal,
    removeAnimal,
    resetBoard
  }
})
