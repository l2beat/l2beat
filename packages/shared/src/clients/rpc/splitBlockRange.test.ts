import { expect } from 'earl'
import { splitBlockRange } from './splitBlockRange'

describe(splitBlockRange.name, () => {
  it('returns the range whole when there is no limit', () => {
    expect(splitBlockRange(100, 25_099)).toEqual([[100, 25_099]])
  })

  it('returns the range whole when it fits the limit', () => {
    expect(splitBlockRange(100, 10_099, 10_000)).toEqual([[100, 10_099]])
  })

  it('cuts a longer range into back-to-back ranges of at most the limit', () => {
    expect(splitBlockRange(100, 25_099, 10_000)).toEqual([
      [100, 10_099],
      [10_100, 20_099],
      [20_100, 25_099],
    ])
  })

  it('rejects a limit that would never advance', () => {
    expect(() => splitBlockRange(100, 200, 0)).toThrow(
      'Block range limit must be positive',
    )
  })
})
