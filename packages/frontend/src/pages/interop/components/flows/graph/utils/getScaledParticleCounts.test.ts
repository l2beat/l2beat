import { expect } from 'earl'
import { getScaledParticleCounts } from './getScaledParticleCounts'

describe(getScaledParticleCounts.name, () => {
  it('returns the original counts at $50 when both caps are satisfied', () => {
    const result = getScaledParticleCounts([12, 7, 0.5])
    expect(result.counts).toEqual([12, 7, 0.5])
    expect(result.dollarsPerParticle).toEqual(50)
  })

  it('steps up to the next allowed value when per-flow cap is exceeded', () => {
    // base counts [100, 70, 10] — max=100 > 60
    // minByMax = 100*50/60 ≈ 83.33 → next allowed value is $100
    const result = getScaledParticleCounts([100, 70, 10])
    expect(result.counts).toEqual([50, 35, 5])
    expect(result.dollarsPerParticle).toEqual(100)
  })

  it('steps up to the next allowed value when global cap is exceeded', () => {
    // 20 flows of 60 each — total=1200 > 700
    // minByTotal = 1200*50/700 ≈ 85.71 → next allowed value is $100
    const result = getScaledParticleCounts(Array.from({ length: 20 }, () => 60))
    expect(result.counts).toEqual(Array.from({ length: 20 }, () => 30))
    expect(result.dollarsPerParticle).toEqual(100)
  })

  it('continues in $50 multiples beyond the last fixed option', () => {
    // base 100, minByMax = 100*100/60 ≈ 166.67 → 200
    const result = getScaledParticleCounts([100, 70, 10], 100)
    expect(Math.max(...result.counts) <= 60).toEqual(true)
    expect(result.counts.reduce((s, c) => s + c, 0) <= 700).toEqual(true)
    expect(result.dollarsPerParticle).toEqual(200)
  })

  it('scales a low base up through the fixed options', () => {
    // base 1, max=100 > 60 → minByMax = 100*1/60 ≈ 1.67 → next option is 5
    const result = getScaledParticleCounts([100, 70, 10], 1)
    expect(result.dollarsPerParticle).toEqual(5)
    expect(result.counts).toEqual([20, 14, 2])
  })

  it('keeps a sub-dollar base when caps are satisfied', () => {
    const result = getScaledParticleCounts([3, 1], 0.1)
    expect(result.counts).toEqual([3, 1])
    expect(result.dollarsPerParticle).toEqual(0.1)
  })

  it('scales a sub-dollar base to the next sub-dollar option', () => {
    // base 0.1, max=200 > 60 → minByMax = 200*0.1/60 ≈ 0.33 → next option is 0.5
    const result = getScaledParticleCounts([200], 0.1)
    expect(result.dollarsPerParticle).toEqual(0.5)
    expect(result.counts).toEqual([40])
  })

  it('returns empty counts for empty input', () => {
    const result = getScaledParticleCounts([])
    expect(result.counts).toEqual([])
    expect(result.dollarsPerParticle).toEqual(50)
  })

  it('returns quickly for very large values without iterating', () => {
    const start = Date.now()
    const result = getScaledParticleCounts([1e12, 5e11, 1e10])
    const elapsed = Date.now() - start

    expect(elapsed < 50).toEqual(true)
    expect(Math.max(...result.counts) <= 60).toEqual(true)
    expect(result.counts.reduce((s, c) => s + c, 0) <= 700).toEqual(true)
  })

  it('honors caps when the closed-form result lands at a step boundary', () => {
    // maxBase=600 → minByMax = 600*50/60 = 500, dpp = 500, scale = 0.1.
    // 0.1 is not exact in floating point, so 600*0.1 can land just above 60.
    // The re-check should bump to the next allowed value if so.
    const result = getScaledParticleCounts([600])
    expect(Math.max(...result.counts) <= 60).toEqual(true)
  })

  it('handles a single flow exactly at the per-flow cap', () => {
    const result = getScaledParticleCounts([60])
    expect(result.counts).toEqual([60])
    expect(result.dollarsPerParticle).toEqual(50)
  })

  it('handles totals exactly at the global cap', () => {
    // 14 flows of 50 each: total = 700, max = 50 — both at/under caps.
    const input = Array.from({ length: 14 }, () => 50)
    const result = getScaledParticleCounts(input)
    expect(result.dollarsPerParticle).toEqual(50)
    expect(result.counts.reduce((s, c) => s + c, 0)).toEqual(700)
  })
})
