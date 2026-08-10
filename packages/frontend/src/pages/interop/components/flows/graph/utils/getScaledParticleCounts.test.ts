import { expect } from 'earl'
import { getScaledParticleCounts } from './getScaledParticleCounts'

describe(getScaledParticleCounts.name, () => {
  it('returns the original counts at $50 when both caps are satisfied', () => {
    const result = getScaledParticleCounts([12, 7, 0.5])
    expect(result.counts).toEqual([12, 7, 0.5])
    expect(result.dollarsPerParticle).toEqual(50)
  })

  it('increases dollars per particle in $5 steps when per-flow cap is exceeded', () => {
    // base counts [100, 70, 10] — max=100 > 60, need to step up
    // minByMax = 100*50/60 ≈ 83.33, rounded up to $85
    const result = getScaledParticleCounts([100, 70, 10])
    expect(result.dollarsPerParticle).toEqual(85)
    expect(Math.max(...result.counts) <= 60).toEqual(true)
    expect(result.counts.reduce((s, c) => s + c, 0) <= 700).toEqual(true)
  })

  it('increases dollars per particle when global cap is exceeded', () => {
    // 20 flows of 60 each — total=1200 > 700
    // minByTotal = 1200*50/700 ≈ 85.71, rounded up to $90
    const result = getScaledParticleCounts(Array.from({ length: 20 }, () => 60))
    expect(result.dollarsPerParticle).toEqual(90)
    expect(result.counts.reduce((s, c) => s + c, 0) <= 700).toEqual(true)
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
    // The re-check should bump one step if so.
    const result = getScaledParticleCounts([600])
    expect(Math.max(...result.counts) <= 60).toEqual(true)
  })

  it('respects a custom baseDollarsPerParticle', () => {
    // Same shape as the per-flow-cap test but starting at $100.
    // minByMax = 100*100/60 ≈ 166.67, rounded up to $170.
    const result = getScaledParticleCounts([100, 70, 10], 100)
    expect(Math.max(...result.counts) <= 60).toEqual(true)
    expect(result.counts.reduce((s, c) => s + c, 0) <= 700).toEqual(true)
    expect(result.dollarsPerParticle).toEqual(170)
  })

  it('scales a low base up to a clean step multiple', () => {
    // base 1, max=100 > 60 → minByMax = 100*1/60 ≈ 1.67, rounded up to 5
    const result = getScaledParticleCounts([100, 70, 10], 1)
    expect(result.dollarsPerParticle).toEqual(5)
    expect(result.counts).toEqual([20, 14, 2])
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
