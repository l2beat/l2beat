import type { HourlyActivityRecord } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { aggregatePerHour } from './aggregatePerHour'

const START = UnixTime.fromDate(new Date('2021-01-01T00:00:00Z'))
const PROJECT = ProjectId('project')

describe(aggregatePerHour.name, () => {
  it('sums each hour and keeps the busiest minute of txs and of uops', () => {
    const { records } = aggregatePerHour(PROJECT, [
      block(START + 10, 3, 4, 1),
      block(START + 40, 2, 2, 2),
      block(START + 65, 4, 9, 3),
      block(START + 1 * UnixTime.HOUR - 1, 1, 1, 4),
      block(START + 1 * UnixTime.HOUR, 7, 7, 5),
    ])

    expect(records).toEqual([
      hourlyRecord(START, {
        count: 10,
        uopsCount: 16,
        peakCount: 5,
        peakUopsCount: 9,
      }),
      hourlyRecord(START + 1 * UnixTime.HOUR, {
        count: 7,
        uopsCount: 7,
        peakCount: 7,
        peakUopsCount: 7,
      }),
    ])
  })

  it('adds the part of a minute counted in the previous batch to its peak, not to the hour', () => {
    const result = aggregatePerHour(
      PROJECT,
      [block(START + 50, 2, 3, 3), block(START + 70, 6, 6, 4)],
      minute(START, 5, 1, 2),
    )

    expect(result).toEqual({
      records: [
        hourlyRecord(START, {
          count: 8,
          uopsCount: 9,
          peakCount: 7,
          peakUopsCount: 8,
        }),
      ],
      lastMinute: minute(START + 60, 6, 4, 4),
    })
  })

  it('keeps counting a minute that spans several batches', () => {
    const result = aggregatePerHour(
      PROJECT,
      [block(START + 20, 2, 2, 3)],
      minute(START, 5, 1, 2),
    )

    expect(result).toEqual({
      records: [
        hourlyRecord(START, {
          count: 2,
          uopsCount: 2,
          peakCount: 7,
          peakUopsCount: 7,
        }),
      ],
      lastMinute: minute(START, 7, 1, 3),
    })
  })

  it('ignores a previous minute that the batch does not continue', () => {
    const result = aggregatePerHour(
      PROJECT,
      [block(START + 70, 2, 2, 3)],
      minute(START, 50, 1, 2),
    )

    expect(result).toEqual({
      records: [
        hourlyRecord(START, {
          count: 2,
          uopsCount: 2,
          peakCount: 2,
          peakUopsCount: 2,
        }),
      ],
      lastMinute: minute(START + 60, 2, 3, 3),
    })
  })

  it('leaves uops empty for a chain without them', () => {
    const { records } = aggregatePerHour(PROJECT, [
      block(START + 10, 3, null, 1),
      block(START + 20, 2, null, 2),
    ])

    expect(records).toEqual([
      hourlyRecord(START, {
        count: 5,
        uopsCount: null,
        peakCount: 5,
        peakUopsCount: null,
      }),
    ])
  })
})

function block(
  timestamp: UnixTime,
  txsCount: number,
  uopsCount: number | null,
  number: number,
) {
  return { timestamp, txsCount, uopsCount, number }
}

/** Uops follow txs */
function minute(
  timestamp: UnixTime,
  count: number,
  start: number,
  end: number,
) {
  return { timestamp, count, uopsCount: count, start, end }
}

function hourlyRecord(
  timestamp: UnixTime,
  values: Omit<HourlyActivityRecord, 'projectId' | 'timestamp'>,
): HourlyActivityRecord {
  return { projectId: PROJECT, timestamp, ...values }
}
