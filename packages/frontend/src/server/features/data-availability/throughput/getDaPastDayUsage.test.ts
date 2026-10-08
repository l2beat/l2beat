import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getCapacity, getSyncedDay, sumUsed } from './getDaPastDayUsage'

const RANGE: [number, number] = [1000, 2000]

describe(sumUsed.name, () => {
  it('sums the records inside the range', () => {
    const used = sumUsed(
      [
        record(999, 1n),
        record(1000, 10n),
        record(1500, 100n),
        record(2000, 1000n),
      ],
      RANGE,
    )

    expect(used).toEqual(110)
  })

  it('returns zero when there is no record', () => {
    expect(sumUsed([], RANGE)).toEqual(0)
  })
})

// Each case places the layer's hourly records somewhere in the two days
// before midnight and today, and checks which 24 hours get summed.
describe(getSyncedDay.name, () => {
  const MIDNIGHT = 10 * UnixTime.DAY
  const fetched: [number, number] = [MIDNIGHT - 2 * UnixTime.DAY, MIDNIGHT]

  it('takes yesterday once the first hour of today is written', () => {
    const day = getSyncedDay(
      [record(MIDNIGHT - UnixTime.HOUR, 1n), record(MIDNIGHT, 1n)],
      fetched,
    )

    expect(day).toEqual([MIDNIGHT - UnixTime.DAY, MIDNIGHT])
  })

  it('takes yesterday however far into today the indexer is', () => {
    const day = getSyncedDay(
      [record(MIDNIGHT + 5 * UnixTime.HOUR, 1n)],
      fetched,
    )

    expect(day).toEqual([MIDNIGHT - UnixTime.DAY, MIDNIGHT])
  })

  it('leaves out the newest hour, which is still being written', () => {
    const day = getSyncedDay(
      [
        record(MIDNIGHT - 2 * UnixTime.HOUR, 1n),
        record(MIDNIGHT - UnixTime.HOUR, 1n),
      ],
      fetched,
    )

    expect(day).toEqual([
      MIDNIGHT - UnixTime.DAY - UnixTime.HOUR,
      MIDNIGHT - UnixTime.HOUR,
    ])
  })

  it('takes the 24 whole hours up to the newest when the indexer lags', () => {
    const day = getSyncedDay(
      [
        record(MIDNIGHT - 5 * UnixTime.HOUR, 1n),
        record(MIDNIGHT - 4 * UnixTime.HOUR, 1n),
      ],
      fetched,
    )

    expect(day).toEqual([
      MIDNIGHT - UnixTime.DAY - 4 * UnixTime.HOUR,
      MIDNIGHT - 4 * UnixTime.HOUR,
    ])
  })

  it('returns nothing when the indexer is more than a day behind', () => {
    const day = getSyncedDay(
      [record(MIDNIGHT - UnixTime.DAY - 2 * UnixTime.HOUR, 1n)],
      fetched,
    )

    expect(day).toEqual(undefined)
  })

  it('returns nothing when there is no record', () => {
    expect(getSyncedDay([], fetched)).toEqual(undefined)
  })
})

describe(getCapacity.name, () => {
  const day: [number, number] = [1_000_000, 1_000_000 + UnixTime.DAY]
  const throughput = [
    { size: 1200, target: 600, frequency: 12, sinceTimestamp: 0 },
    { size: 2400, target: 1200, frequency: 12, sinceTimestamp: 500_000 },
    { size: 4800, target: 2400, frequency: 12, sinceTimestamp: 2_000_000 },
  ]

  it('measures Ethereum against its target', () => {
    // 1200 B every 12 s for a day
    expect(getCapacity('ethereum', throughput, day)).toEqual(8_640_000)
  })

  it('measures other layers against their maximum', () => {
    expect(getCapacity('celestia', throughput, day)).toEqual(17_280_000)
  })

  it('uses the limits in force when the range started', () => {
    const later: [number, number] = [2_000_000, 2_000_000 + UnixTime.DAY]
    expect(getCapacity('ethereum', throughput, later)).toEqual(17_280_000)
  })

  it('returns nothing for a layer without a cap', () => {
    expect(
      getCapacity(
        'eigenda',
        [{ size: 'NO_CAP', frequency: 1, sinceTimestamp: 0 }],
        day,
      ),
    ).toEqual(undefined)
  })

  it('returns nothing before any limit was in force', () => {
    expect(getCapacity('ethereum', throughput.slice(2), day)).toEqual(undefined)
    expect(getCapacity('ethereum', [], day)).toEqual(undefined)
  })
})

function record(timestamp: number, totalSize: bigint) {
  return { timestamp: UnixTime(timestamp), totalSize }
}
