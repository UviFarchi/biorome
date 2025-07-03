// Factory for creating Animal objects with sensible defaults

export function createAnimal(options = {}) {
  const {
    type = 'Chicken',
    favoriteFoods = ['Grass'],
    hunger = { current: 0, max: 100 },
    thirst = { current: 0, max: 100 },
    mood = 'Calm',
    output = 'Eggs',
    collarZone = null,
    tilePos = { row: null, col: null }
  } = options

  return {
    type,
    favoriteFoods: [...favoriteFoods],
    hunger: { ...hunger },
    thirst: { ...thirst },
    mood,
    output,
    collarZone: collarZone ? [...collarZone] : null,
    tilePos: { ...tilePos }
  }
}
