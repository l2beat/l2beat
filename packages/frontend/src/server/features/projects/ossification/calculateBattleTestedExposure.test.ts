import { expect } from 'earl'
import { calculateBattleTestedExposure } from './calculateBattleTestedExposure'

const YEAR = 365 * 24 * 60 * 60

describe(calculateBattleTestedExposure.name, () => {
  it('clips and interpolates the first interval', () => {
    const result = calculateBattleTestedExposure(
      [
        { timestamp: 0, value: 0 },
        { timestamp: 2 * YEAR, value: 2 },
        { timestamp: 3 * YEAR, value: 2 },
      ],
      YEAR,
      3 * YEAR,
    )

    expect(result).toEqual(3.5)
  })

  it('extends the latest value to the end of the period', () => {
    const result = calculateBattleTestedExposure(
      [{ timestamp: 0, value: 5 }],
      YEAR,
      3 * YEAR,
    )

    expect(result).toEqual(10)
  })

  it('starts at the first known sample when earlier TVS is unavailable', () => {
    const result = calculateBattleTestedExposure(
      [{ timestamp: 2 * YEAR, value: 3 }],
      YEAR,
      3 * YEAR,
    )

    expect(result).toEqual(3)
  })

  it('returns null when the period has no TVS samples', () => {
    const result = calculateBattleTestedExposure(
      [{ timestamp: 4 * YEAR, value: 3 }],
      YEAR,
      3 * YEAR,
    )

    expect(result).toEqual(null)
  })
})
