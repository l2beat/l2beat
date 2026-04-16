import { expect } from 'earl'
import { getScaledParticleCounts } from './getScaledParticleCounts'

describe(getScaledParticleCounts.name, () => {
  it('returns the original counts at $50 when both caps are satisfied', () => {
    const result = getScaledParticleCounts([12, 7, 0.5])
    expect(result.counts).toEqual([12, 7, 0.5])
    expect(result.dollarsPerParticle).toEqual(50)
  })

  it('increases dollars per particle in $25 steps when per-flow cap is exceeded', () => {
    // base counts [100, 70, 10] — max=100 > 60, need to step up
    // $75: 100*(50/75)=66.67 > 60, fail
    // $100: 100*(50/100)=50 ≤ 60, total=90 ≤ 700, pass
    const result = getScaledParticleCounts([100, 70, 10])
    expect(result.counts).toEqual([50, 35, 5])
    expect(result.dollarsPerParticle).toEqual(100)
  })

  it('increases dollars per particle when global cap is exceeded', () => {
    // 20 flows of 60 each — total=1200 > 700
    // $75: 60*(50/75)=40, total=800 > 700, fail
    // $100: 60*(50/100)=30, total=600 ≤ 700, pass
    const result = getScaledParticleCounts(Array.from({ length: 20 }, () => 60))
    expect(result.counts).toEqual(Array.from({ length: 20 }, () => 30))
    expect(result.dollarsPerParticle).toEqual(100)
  })

  it('returns empty counts for empty input', () => {
    const result = getScaledParticleCounts([])
    expect(result.counts).toEqual([])
    expect(result.dollarsPerParticle).toEqual(50)
  })
})
