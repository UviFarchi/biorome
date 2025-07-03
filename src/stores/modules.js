import { defineStore } from 'pinia'
import { useBoardStore } from './board'

export const useModulesStore = defineStore('modules', () => {
  // Available modules per day
  const moduleTypes = ['Transport', 'Fertilizer', 'Irrigator', 'Collector', 'Feeder', 'Collar']
  const defaultDailyUses = 3
  const modules = moduleTypes.map(type => ({ type, usesLeft: defaultDailyUses }))

  // simple reactive state
  const state = {
    modules
  }

  function getModule(type) {
    return state.modules.find(m => m.type === type)
  }

  function decrementUse(type) {
    const m = getModule(type)
    if (m && m.usesLeft > 0) {
      m.usesLeft--
    } else {
      throw new Error(`${type} module has no uses left`)
    }
  }

  function resetDailyUses() {
    state.modules.forEach(m => {
      m.usesLeft = defaultDailyUses
    })
  }

  // Assemble a set of modules into an assembly object
  function assemble(selectedTypes = []) {
    const unique = [...new Set(selectedTypes)].filter(t => moduleTypes.includes(t))
    return { modules: unique }
  }

  // Deploy an assembly to a board tile
  function deploy(row, col, assembly) {
    if (!assembly || !assembly.modules) return
    const board = useBoardStore()
    const tile = board.getTile(row, col)
    if (!tile) return

    assembly.modules.forEach(type => {
      const mod = getModule(type)
      if (!mod || mod.usesLeft <= 0) return
      applyModuleEffect(type, tile)
      decrementUse(type)
    })
  }

  // Apply effects for each module type
  function applyModuleEffect(type, tile) {
    switch (type) {
      case 'Fertilizer':
        tile.soil.fertility += 1
        break
      case 'Irrigator':
        if (tile.plant) {
          tile.plant.water = (tile.plant.water || 0) + 1
        }
        break
      case 'Collector':
        if (tile.plant) {
          const board = useBoardStore()
          board.removePlant(tile.row, tile.col)
        }
        break
      case 'Feeder':
        if (tile.animal && tile.animal.hunger) {
          tile.animal.hunger.current = Math.max(0, tile.animal.hunger.current - 10)
        }
        break
      case 'Collar':
        if (tile.animal) {
          tile.animal.collarZone = [tile.row, tile.col]
        }
        break
      case 'Transport':
      default:
        // Transport effect not fully defined; placeholder
        break
    }
  }

  return {
    state,
    assemble,
    deploy,
    resetDailyUses
  }
})
