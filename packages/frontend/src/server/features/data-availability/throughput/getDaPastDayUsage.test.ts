import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getCapacity, getSyncedDay, sumUsed } from './getDaPastDayUsage'

const RANGE: [number, number] = [1000, 2000]

describe(sumUsed.name, () => {
  it("sums the DA layer's own records inside the range", () => {
    const used = sumUsed(
      [
        record('ethereum', 999, 1n),
        record('ethereum', 1000, 10n),
        record('ethereum', 1500, 100n),
        record('ethereum', 2000, 1000n),
        record('base', 1500, 7n),
      ],
      'ethereum',
      RANGE,
    )

    expect(used).toEqual(110)
  })

  it('returns zero when the layer has no record', () => {
    expect(sumUsed([record('base', 1500, 7n)], 'ethereum', RANGE)).toEqual(0)
  })
})

// Each case places the layer's last hourly record somewhere in the two days
// fetched before midnight and checks which 24 hours get summed.
describe(getSyncedDay.name, () => {
  const MIDNIGHT = 10 * UnixTime.DAY
  const fetched: [number, number] = [MIDNIGHT - 2 * UnixTime.DAY, MIDNIGHT]

  it('takes the day up to midnight when its last hour is written', () => {
    const day = getSyncedDay(
      [record('ethereum', MIDNIGHT - UnixTime.HOUR, 1n)],
      'ethereum',
      fetched,
    )

    expect(day).toEqual([MIDNIGHT - UnixTime.DAY, MIDNIGHT])
  })

  it('takes the 24 hours up to the last hour written when the indexer lags', () => {
    const day = getSyncedDay(
      [
        record('ethereum', MIDNIGHT - 5 * UnixTime.HOUR, 1n),
        record('ethereum', MIDNIGHT - 4 * UnixTime.HOUR, 1n),
      ],
      'ethereum',
      fetched,
    )

    expect(day).toEqual([
      MIDNIGHT - UnixTime.DAY - 3 * UnixTime.HOUR,
      MIDNIGHT - 3 * UnixTime.HOUR,
    ])
  })

  it("goes by the layer's own records, not by a project's", () => {
    const day = getSyncedDay(
      [
        record('ethereum', MIDNIGHT - 3 * UnixTime.HOUR, 1n),
        record('base', MIDNIGHT - UnixTime.HOUR, 1n),
      ],
      'ethereum',
      fetched,
    )

    expect(day?.[1]).toEqual(MIDNIGHT - 2 * UnixTime.HOUR)
  })

  it('returns nothing when the indexer is more than a day behind', () => {
    const day = getSyncedDay(
      [record('ethereum', MIDNIGHT - UnixTime.DAY - 2 * UnixTime.HOUR, 1n)],
      'ethereum',
      fetched,
    )

    expect(day).toEqual(undefined)
  })

  it('returns nothing when the layer has no record', () => {
    expect(getSyncedDay([], 'ethereum', fetched)).toEqual(undefined)
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

function record(projectId: string, timestamp: number, totalSize: bigint) {
  return { projectId, timestamp: UnixTime(timestamp), totalSize }
}
