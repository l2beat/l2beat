import { expect } from 'earl'
import { estimateTips, HISTORY_BLOCKS } from './estimateTips'

describe(estimateTips.name, () => {
  it('takes each tier at its share of its window', () => {
    // Block i (oldest 0) tips i/1000 at the 10th percentile and i/100 at the 25th
    const blocks = Array.from({ length: HISTORY_BLOCKS }, (_, i) => [
      i / 1000,
      i / 100,
    ])

    expect(estimateTips(blocks)).toEqual({
      // The last 300 blocks are 1500 to 1799: index floor(0.4522 * 300) = 135
      slow: 1.635,
      // floor(0.85 * 300) = 255
      medium: 17.55,
      // All 1800 blocks: floor(0.99 * 1800) = 1782
      fast: 17.82,
    })
  })

  it('keeps each tier at least the one below', () => {
    const blocks = Array.from({ length: HISTORY_BLOCKS }, () => [5, 1])

    expect(estimateTips(blocks)).toEqual({ slow: 5, medium: 5, fast: 5 })
  })

  it('fails with fewer blocks than the fast window', () => {
    expect(() => estimateTips([[1, 1]])).toThrow('Too few blocks')
  })
})
