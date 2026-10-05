import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  getBatchIntervals,
  getCapacity,
  sumPostedByProject,
  sumPostedByProjectHourly,
  sumUsed,
} from './getDaFlows'

const RANGE: [number, number] = [1000, 2000]

describe(sumPostedByProject.name, () => {
  it('sums the records of each project', () => {
    const posted = sumPostedByProject(
      [
        record('base', 1000, 100n),
        record('arbitrum', 1500, 40n),
        record('base', 1999, 50n),
      ],
      'ethereum',
      RANGE,
    )

    expect(posted).toEqual({ base: 150, arbitrum: 40 })
  })

  it("leaves out the DA layer's own total", () => {
    const posted = sumPostedByProject(
      [record('ethereum', 1500, 1000n), record('base', 1500, 100n)],
      'ethereum',
      RANGE,
    )

    expect(posted).toEqual({ base: 100 })
  })

  it('leaves out records outside the range', () => {
    const posted = sumPostedByProject(
      [
        record('base', 999, 1n),
        record('base', 1000, 10n),
        record('base', 2000, 100n),
      ],
      'ethereum',
      RANGE,
    )

    expect(posted).toEqual({ base: 10 })
  })

  it('returns nothing for no records', () => {
    expect(sumPostedByProject([], 'ethereum', RANGE)).toEqual({})
  })
})

// Two hours from a round start, so each record's hour is plain to see
describe(sumPostedByProjectHourly.name, () => {
  const TWO_HOURS: [number, number] = [0, 2 * UnixTime.HOUR]

  it('puts every record in the hour it was kept under', () => {
    const posted = sumPostedByProjectHourly(
      [
        record('base', 0, 10n),
        record('base', UnixTime.HOUR, 20n),
        record('arbitrum', UnixTime.HOUR, 5n),
      ],
      'ethereum',
      TWO_HOURS,
    )

    expect(posted).toEqual({ base: [10, 20], arbitrum: [0, 5] })
  })

  it("leaves out the DA layer's own total and records outside the range", () => {
    const posted = sumPostedByProjectHourly(
      [
        record('ethereum', 0, 1000n),
        record('base', 2 * UnixTime.HOUR, 100n),
        record('base', 0, 1n),
      ],
      'ethereum',
      TWO_HOURS,
    )

    expect(posted).toEqual({ base: [1, 0] })
  })
})

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

describe(getBatchIntervals.name, () => {
  it('reads the batch submissions of each project', () => {
    const intervals = getBatchIntervals(
      [
        { projectId: 'base', subtype: 'batchSubmissions', avg: 54 },
        { projectId: 'base', subtype: 'stateUpdates', avg: 3600 },
        { projectId: 'arbitrum', subtype: 'batchSubmissions', avg: 132.5 },
      ],
      [],
    )

    expect(intervals).toEqual({ base: 54, arbitrum: 132.5 })
  })

  it('leaves out a project with no batch submissions', () => {
    const intervals = getBatchIntervals(
      [{ projectId: 'abstract', subtype: 'stateUpdates', avg: 3600 }],
      [],
    )

    expect(intervals).toEqual({})
  })

  it('reads the transactions that stand for batch submissions', () => {
    const intervals = getBatchIntervals(
      [
        { projectId: 'a', subtype: 'batchSubmissions', avg: 10 },
        { projectId: 'a', subtype: 'stateUpdates', avg: 600 },
        { projectId: 'b', subtype: 'batchSubmissions', avg: 20 },
        { projectId: 'b', subtype: 'stateUpdates', avg: 700 },
      ],
      [
        {
          id: 'a',
          livenessConfig: {
            duplicateData: { from: 'stateUpdates', to: 'batchSubmissions' },
          },
        },
        {
          id: 'b',
          livenessConfig: {
            duplicateData: { from: 'stateUpdates', to: 'proofSubmissions' },
          },
        },
      ],
    )

    expect(intervals).toEqual({ a: 600, b: 20 })
  })

  it('leaves out an interval of no length', () => {
    const intervals = getBatchIntervals(
      [{ projectId: 'a', subtype: 'batchSubmissions', avg: 0 }],
      [],
    )

    expect(intervals).toEqual({})
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
