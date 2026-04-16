import { expect } from 'earl'
import { getScaledParticleCounts } from './getScaledParticleCounts'

describe(getScaledParticleCounts.name, () => {
  it('returns the original counts when they are within both caps', () => {
    expect(getScaledParticleCounts([12, 7, 0.5])).toEqual([12, 7, 0.5])
  })

  it('scales all flows proportionally when one flow exceeds the local cap', () => {
    expect(getScaledParticleCounts([100, 70, 10])).toEqual([60, 42, 6])
  })

  it('applies the global cap after the local scale', () => {
    expect(
      getScaledParticleCounts(Array.from({ length: 20 }, () => 60)),
    ).toEqual(Array.from({ length: 20 }, () => 35))
  })

  it('clamps negative counts to zero', () => {
    expect(getScaledParticleCounts([-5, 10])).toEqual([0, 10])
  })
})
