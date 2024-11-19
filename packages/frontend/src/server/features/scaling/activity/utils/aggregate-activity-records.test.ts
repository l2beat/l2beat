import { type ActivityRecord } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { aggregateActivityRecords } from './aggregate-activity-records'

describe(aggregateActivityRecords.name, () => {
  const NOW = UnixTime.now()

  it('aggregates activity records correctly', () => {
    const records: ActivityRecord[] = [
      record(NOW, ProjectId('arbitrum'), 100),
      record(NOW, ProjectId('optimism'), 50),
      record(NOW, ProjectId.ETHEREUM, 1000),
      record(NOW.add(1, 'days'), ProjectId('arbitrum'), 200),
      record(NOW.add(1, 'days'), ProjectId.ETHEREUM, 2000),
    ]

    const result = aggregateActivityRecords(records)

    expect(result).toEqual({
      [NOW.toNumber()]: {
        timestamp: NOW,
        count: 150, // 100 + 50
        ethereumCount: 1000,
      },
      [NOW.add(1, 'days').toNumber()]: {
        timestamp: NOW.add(1, 'days'),
        count: 200,
        ethereumCount: 2000,
      },
    })
  })

  it('returns undefined when no non-Ethereum records with count > 0 exist', () => {
    const records: ActivityRecord[] = [
      record(NOW, ProjectId.ETHEREUM, 1000),
      record(NOW.add(1, 'days'), ProjectId.ETHEREUM, 2000),
      record(NOW.add(2, 'days'), ProjectId('arbitrum'), 0),
    ]

    const result = aggregateActivityRecords(records)

    expect(result).toEqual(undefined)
  })

  it('starts aggregating from the first non-Ethereum record with count > 0', () => {
    const records: ActivityRecord[] = [
      record(NOW, ProjectId.ETHEREUM, 1000),
      record(NOW.add(1, 'days'), ProjectId('arbitrum'), 0),
      record(NOW.add(2, 'days'), ProjectId('arbitrum'), 100),
      record(NOW.add(2, 'days'), ProjectId.ETHEREUM, 2000),
    ]

    const result = aggregateActivityRecords(records)

    expect(result).toEqual({
      [NOW.add(2, 'days').toNumber()]: {
        timestamp: NOW.add(2, 'days'),
        count: 100,
        ethereumCount: 2000,
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
): ActivityRecord => ({
  timestamp,
  projectId,
  count,
  uopsCount: 0,
  start: 0,
  end: 0,
})
