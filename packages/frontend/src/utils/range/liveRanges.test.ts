import { LIVE_BUFFER_SECONDS } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  getLiveBucketSeconds,
  isLiveFresh,
  LIVE_RANGE_KEYS,
  LIVE_RANGES,
} from './liveRanges'

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

describe('LIVE_RANGES', () => {
  it('reaches as far back as the blocks are kept', () => {
    expect(
      Math.max(...LIVE_RANGE_KEYS.map((key) => LIVE_RANGES[key].seconds)),
    ).toEqual(LIVE_BUFFER_SECONDS)
  })
})

describe(getLiveBucketSeconds.name, () => {
  it('splits every range into 150 whole seconds', () => {
    expect(LIVE_RANGE_KEYS.map(getLiveBucketSeconds)).toEqual([2, 6, 24, 96])
  })
})
