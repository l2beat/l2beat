import { expect } from 'earl'
import { getScaledParticleCounts } from './getScaledParticleCounts'

describe(getScaledParticleCounts.name, () => {
  it('returns the original counts when they are within both caps', () => {
    const result = getScaledParticleCounts([12, 7, 0.5])
    expect(result.counts).toEqual([12, 7, 0.5])
    expect(result.combinedScale).toEqual(1)
  })

  it('scales all flows proportionally when one flow exceeds the local cap', () => {
    const result = getScaledParticleCounts([100, 70, 10])
    expect(result.counts).toEqual([60, 42, 6])
    expect(result.combinedScale).toEqual(0.6)
  })

  it('applies the global cap after the local scale', () => {
    const result = getScaledParticleCounts(Array.from({ length: 20 }, () => 60))
    expect(result.counts).toEqual(Array.from({ length: 20 }, () => 35))
    // localScale = 1 (max=60 ≤ 60), globalScale = 700/1200
    expect(result.combinedScale).toEqual(700 / 1200)
  })
})
