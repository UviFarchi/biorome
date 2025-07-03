// Simple factory for creating Plant objects
// The factory allows overriding defaults via an options object

export function createPlant(options = {}) {
  const {
    type = 'Grass',
    growthStage = 'Seedling',
    preferredSeason = 'Spring',
    waterRequired = 1,
    fertilizerRequired = 0,
    tolerance = {
      minWater: 0,
      maxWater: 10,
      minFertilizer: 0,
      maxFertilizer: 10
    },
    yieldAmount = 1,
    tilePos = { row: null, col: null }
  } = options

  return {
    type,
    growthStage,
    preferredSeason,
    waterRequired,
    fertilizerRequired,
    tolerance: { ...tolerance },
    yield: yieldAmount,
    tilePos: { ...tilePos }
  }
}
