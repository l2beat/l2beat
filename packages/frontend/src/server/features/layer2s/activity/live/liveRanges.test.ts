import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { isLiveFresh } from './liveRanges'

describe(isLiveFresh.name, () => {
  const now = UnixTime(1_800_000_000)

  it('is fresh while the newest block is under half an hour old', () => {
    expect(isLiveFresh(now - 29 * UnixTime.MINUTE, now)).toEqual(true)
    expect(isLiveFresh(now - 30 * UnixTime.MINUTE, now)).toEqual(true)
  })

  it('is not once the newest block is older, or there is none', () => {
    expect(isLiveFresh(now - 31 * UnixTime.MINUTE, now)).toEqual(false)
    expect(isLiveFresh(undefined, now)).toEqual(false)
  })
})
