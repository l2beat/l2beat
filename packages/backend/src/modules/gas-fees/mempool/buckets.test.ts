import { expect } from 'earl'
import { TIP_LEVELS, toWaitBucket } from './buckets'

describe('mempool buckets', () => {
  it('has contiguous tip levels from 0.01 to 2.05 gwei', () => {
    expect(TIP_LEVELS).toHaveLength(69)
    expect(TIP_LEVELS[0]).toEqual({ fromWei: 10_000_000, toWei: 10_797_752 })
    expect(TIP_LEVELS.at(-1)).toEqual({
      fromWei: 2_000_000_000,
      toWei: 2_050_000_000,
    })
    for (const [i, level] of TIP_LEVELS.slice(1).entries()) {
      expect(level.fromWei).toEqual(TIP_LEVELS[i]?.toWei ?? 0)
    }
    // Round tips open a level, so 1 gwei is not split
    expect(TIP_LEVELS.some((l) => l.fromWei === 1e9)).toEqual(true)
    expect(TIP_LEVELS.some((l) => l.fromWei === 1e8)).toEqual(true)
  })

  it('maps the query wait buckets to milliseconds', () => {
    expect(toWaitBucket(0)).toEqual({ waitFromMs: 0, waitToMs: 500 })
    expect(toWaitBucket(239)).toEqual({
      waitFromMs: 119_500,
      waitToMs: 120_000,
    })
    expect(toWaitBucket(240)).toEqual({
      waitFromMs: 120_000,
      waitToMs: 300_000,
    })
    expect(toWaitBucket(243)).toEqual({ waitFromMs: 1_800_000, waitToMs: null })
    expect(() => toWaitBucket(244)).toThrow('Unknown wait bucket')
  })
})
