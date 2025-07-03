import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useModulesStore } from './modules'
import { useVillagerStore } from './villagers'
import { useBoardStore } from './board'

export const useGameStateStore = defineStore('game', () => {
  const day = ref(1)
  const turn = ref(1)

  const seasons = ['Spring', 'Summer', 'Autumn', 'Winter']
  const daysPerSeason = 5
  const season = ref(seasons[0])

  const weatherOptions = ['Rain', 'Drought', 'Storm', 'Normal']
  const weather = ref('Normal')

  const activeEvents = ref([])
  const score = ref(0)
  const gameOver = ref(false)
  const win = ref(false)

  function setSeasonByDay(currentDay) {
    const index = Math.floor((currentDay - 1) / daysPerSeason) % seasons.length
    season.value = seasons[index]
  }

  function rollWeather() {
    const idx = Math.floor(Math.random() * weatherOptions.length)
    weather.value = weatherOptions[idx]
  }

  function setEvents(events = []) {
    activeEvents.value = events
  }

  function triggerEvent(event) {
    if (event === 'Pest Outbreak') {
      const board = useBoardStore()
      board.plants.forEach(p => {
        p.growthStage = 'Damaged'
      })
    }
  }

  function startDay() {
    setSeasonByDay(day.value)
    rollWeather()

    const possibleEvents = ['Pest Outbreak', 'Villager Demand Surge']
    if (Math.random() < 0.3) {
      const e = possibleEvents[Math.floor(Math.random() * possibleEvents.length)]
      setEvents([e])
    } else {
      setEvents([])
    }
  }

  function nextDay() {
    day.value += 1
    turn.value += 1

    const modules = useModulesStore()
    modules.resetDailyUses()

    const villagers = useVillagerStore()
    villagers.decrementTimers()
    villagers.generateNewVillagers()

    startDay()
  }

  function addScore(points) {
    score.value += points
  }

  function endGame({ win: didWin = false } = {}) {
    gameOver.value = true
    win.value = didWin
  }

  return {
    day,
    turn,
    season,
    weather,
    activeEvents,
    score,
    gameOver,
    win,
    nextDay,
    startDay,
    setSeasonByDay,
    rollWeather,
    setEvents,
    triggerEvent,
    addScore,
    endGame
  }
})
