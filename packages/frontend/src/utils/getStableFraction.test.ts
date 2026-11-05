import { expect } from 'earl'
import { getStableFraction } from './getStableFraction'

describe(getStableFraction.name, () => {
  it('returns the same fraction for the same key', () => {
    expect(getStableFraction('safe:privacy')).toEqual(
      getStableFraction('safe:privacy'),
    )
  })

  it('returns a fraction in [0, 1)', () => {
    for (const key of ['', 'a', 'safe:privacy', 'uniswap-v3:security']) {
      const fraction = getStableFraction(key)
      expect(fraction).toBeGreaterThanOrEqual(0)
      expect(fraction).toBeLessThan(1)
    }
  })
})
