import { describe, expect, it } from 'vitest'
import { getWindowedLogZScore } from './zScore'

describe(getWindowedLogZScore.name, () => {
  it('keeps the classic spike signal when the robust score drops out on a flat baseline', () => {
    const result = getWindowedLogZScore([
      100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 101,
      1_000_000,
    ])

    expect(result.robust).toBe(null)
    expect(result.classic !== null ? result.classic > 7 : false).toBe(true)
  })

  it('suppresses z-scores for sparse mostly-zero history', () => {
    const result = getWindowedLogZScore([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 100,
    ])

    expect(result).toEqual({
      robust: null,
      classic: null,
    })
  })
})
