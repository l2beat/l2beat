import { LIVE_BUFFER_SECONDS } from '@l2beat/database'
import { expect } from 'earl'
import {
  getLiveBucketSeconds,
  LIVE_BUFFER_RANGE,
  LIVE_RANGE_KEYS,
  LIVE_RANGES,
} from './liveRanges'

describe('LIVE_RANGES', () => {
  it('reaches as far back as the blocks are kept', () => {
    expect(LIVE_RANGES[LIVE_BUFFER_RANGE].seconds).toEqual(LIVE_BUFFER_SECONDS)
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
