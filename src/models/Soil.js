// Factory for creating Soil objects

export function createSoil(options = {}) {
  const {
    fertility = 1,
    health = { current: 100, max: 100 },
    recoveryRate = 1,
    tilePos = { row: null, col: null }
  } = options

  return {
    fertility,
    health: { ...health },
    recoveryRate,
    tilePos: { ...tilePos }
  }
}
