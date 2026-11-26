import { LIVE_BUFFER_SECONDS } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  formatLiveLength,
  getLiveBucketSeconds,
  getLiveRange,
  getLiveTick,
  LIVE_BUFFER_RANGE,
  LIVE_RANGE_KEYS,
  LIVE_RANGES,
  toLiveLength,
} from './liveRanges'

const MINUTE = UnixTime.MINUTE

describe('LIVE_RANGES', () => {
  it('reaches as far back as the blocks are kept', () => {
    expect(LIVE_RANGES[LIVE_BUFFER_RANGE]).toEqual(LIVE_BUFFER_SECONDS)
    expect(Math.max(...Object.values(LIVE_RANGES))).toEqual(LIVE_BUFFER_SECONDS)
  })
})

describe(toLiveLength.name, () => {
  it('rounds to whole minutes', () => {
    expect(toLiveLength(7 * MINUTE + 29)).toEqual(7 * MINUTE)
    expect(toLiveLength(7 * MINUTE + 30)).toEqual(8 * MINUTE)
  })

  it('keeps between the shortest preset and the buffer', () => {
    expect(toLiveLength(MINUTE)).toEqual(5 * MINUTE)
    expect(toLiveLength(5 * UnixTime.HOUR)).toEqual(LIVE_BUFFER_SECONDS)
  })

  it('keeps within a shorter maximum, but not under the shortest preset', () => {
    expect(toLiveLength(20 * MINUTE, 12 * MINUTE + 50)).toEqual(12 * MINUTE)
    expect(toLiveLength(20 * MINUTE, 3 * MINUTE)).toEqual(5 * MINUTE)
  })
})

describe(getLiveRange.name, () => {
  it('finds the preset of a length, and none for another', () => {
    expect(getLiveRange(15 * MINUTE)).toEqual('15m')
    expect(getLiveRange(16 * MINUTE)).toEqual(undefined)
  })
})

describe(getLiveBucketSeconds.name, () => {
  it('splits every preset into 150 whole seconds', () => {
    expect(
      LIVE_RANGE_KEYS.map((key) => getLiveBucketSeconds(LIVE_RANGES[key])),
    ).toEqual([2, 6, 24, 96])
  })

  it('rounds up for any other length', () => {
    expect(getLiveBucketSeconds(7 * MINUTE)).toEqual(3)
  })
})

describe(getLiveTick.name, () => {
  it('keeps the presets ticks', () => {
    expect(
      LIVE_RANGE_KEYS.map((key) => getLiveTick(LIVE_RANGES[key]) / MINUTE),
    ).toEqual([1, 3, 15, 60])
  })

  it('takes the shortest step a fifth of the length fits in', () => {
    expect(getLiveTick(7 * MINUTE)).toEqual(2 * MINUTE)
    expect(getLiveTick(2 * UnixTime.HOUR)).toEqual(30 * MINUTE)
  })
})

describe(formatLiveLength.name, () => {
  it('reads the presets as before', () => {
    expect(
      LIVE_RANGE_KEYS.map((key) => formatLiveLength(LIVE_RANGES[key])),
    ).toEqual(['5 min', '15 min', 'hour', '4 hours'])
  })

  it('reads hours and minutes', () => {
    expect(formatLiveLength(80 * MINUTE)).toEqual('1 h 20 min')
    expect(formatLiveLength(2 * UnixTime.HOUR)).toEqual('2 hours')
  })
})
