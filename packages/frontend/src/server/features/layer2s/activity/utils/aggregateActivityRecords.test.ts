import type { ActivityRecord } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { aggregateActivityRecords } from './aggregateActivityRecords'

describe(aggregateActivityRecords.name, () => {
  const NOW = UnixTime.toStartOf(UnixTime.now(), 'day')

  it('aggregates activity records correctly', () => {
    const records: ActivityRecord[] = [
      record(NOW, ProjectId('arbitrum'), 100, null),
      record(NOW, ProjectId('optimism'), 50, 200),
      record(NOW, ProjectId.ETHEREUM, 1000, 1000),
      record(NOW + 1 * UnixTime.DAY, ProjectId('arbitrum'), 200, null),
      record(NOW + 1 * UnixTime.DAY, ProjectId.ETHEREUM, 2000, 2100),
    ]

    const result = aggregateActivityRecords(records)

    expect(result).toEqual({
      [NOW]: {
        timestamp: NOW,
        count: 150, // 100 + 50
        ethereumCount: 1000,
        uopsCount: 300,
        ethereumUopsCount: 1000,
      },
      [NOW + 1 * UnixTime.DAY]: {
        timestamp: NOW + 1 * UnixTime.DAY,
        count: 200,
        ethereumCount: 2000,
        uopsCount: 200,
        ethereumUopsCount: 2100,
      },
    })
  })

  it('returns undefined when no non-Ethereum records with count > 0 exist', () => {
    const records: ActivityRecord[] = [
      record(NOW, ProjectId.ETHEREUM, 1000, null),
      record(NOW + 1 * UnixTime.DAY, ProjectId.ETHEREUM, 2000, null),
      record(NOW + 2 * UnixTime.DAY, ProjectId('arbitrum'), 0, null),
    ]

    const result = aggregateActivityRecords(records)

    expect(result).toEqual(undefined)
  })

  it('starts aggregating from the first non-Ethereum record with count > 0', () => {
    const records: ActivityRecord[] = [
      record(NOW, ProjectId.ETHEREUM, 1000, null),
      record(NOW + 1 * UnixTime.DAY, ProjectId('arbitrum'), 0, null),
      record(NOW + 2 * UnixTime.DAY, ProjectId('arbitrum'), 100, 200),
      record(NOW + 2 * UnixTime.DAY, ProjectId.ETHEREUM, 2000, null),
    ]

    const result = aggregateActivityRecords(records)

    expect(result).toEqual({
      [NOW + 2 * UnixTime.DAY]: {
        timestamp: NOW + 2 * UnixTime.DAY,
        count: 100,
        ethereumCount: 2000,
        uopsCount: 200,
        ethereumUopsCount: 2000,
      },
    })
  })

  it('handles empty input array', () => {
    const result = aggregateActivityRecords([])
    expect(result).toEqual(undefined)
  })
})

const record = (
  timestamp: UnixTime,
  projectId: ProjectId,
  count: number,
  uopsCount: number | null,
): ActivityRecord => ({
  timestamp,
  projectId,
  count,
  uopsCount,
  start: 0,
  end: 0,
})
