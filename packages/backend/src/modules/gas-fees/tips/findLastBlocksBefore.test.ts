import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn } from 'earl'
import { findLastBlocksBefore } from './findLastBlocksBefore'

describe(findLastBlocksBefore.name, () => {
  it('finds the last block before each hour, guessing after the first', async () => {
    // A block every 12 s slot from 11 s past t0, with every 50th slot missed
    const t0 = UnixTime.fromDate(new Date('2026-10-01T00:00:00Z'))
    const timestamps: number[] = []
    for (let slot = 0; timestamps.length < 2000; slot++) {
      if (slot % 50 !== 49) timestamps.push(t0 + 11 + slot * 12)
    }
    const getBlockTimestamp = mockFn(
      async (n: number) => timestamps[n] ?? Number.POSITIVE_INFINITY,
    )
    const lastBefore = (t: number) =>
      timestamps.filter((x) => x <= t).length - 1
    const finder = {
      getBlockNumberAtOrBefore: mockFn(async (t: UnixTime) => lastBefore(t)),
    }
    const hours = [1, 2, 3, 4, 5, 6].map((h) => UnixTime(t0 + h * 3600))

    expect(
      await findLastBlocksBefore(finder, { getBlockTimestamp }, hours),
    ).toEqual(
      hours.map((timestamp) => ({
        timestamp,
        blockNumber: lastBefore(timestamp),
      })),
    )
    expect(finder.getBlockNumberAtOrBefore).toHaveBeenCalledTimes(1)
    expect(getBlockTimestamp.calls.length).toBeLessThanOrEqual(6 * 4)
  })
})
