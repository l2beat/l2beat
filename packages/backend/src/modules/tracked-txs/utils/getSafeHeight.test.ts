import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { TrackedTxsConfigRecord } from '../repositories/TrackedTxsConfigsRepository'
import { getSafeHeight } from './getSafeHeight'

const MIN_TIMESTAMP = UnixTime.fromDate(new Date('2021-01-01'))
const NOW = UnixTime.fromDate(new Date('2023-01-01'))

describe(getSafeHeight.name, () => {
  it('returns minTimestamp if database is empty', () => {
    const databaseEntries: TrackedTxsConfigRecord[] = []

    const result = getSafeHeight(databaseEntries, MIN_TIMESTAMP)

    expect(result).toEqual(MIN_TIMESTAMP.toNumber())
  })

  it('returns minTimestamp if no applicable entries', () => {
    const databaseEntries: TrackedTxsConfigRecord[] = [
      mockDatabaseEntry({ lastSyncedTimestamp: undefined }),
      mockDatabaseEntry({
        lastSyncedTimestamp: NOW.add(-5, 'hours'),
        untilTimestampExclusive: NOW.add(-5, 'hours'),
      }),
    ]

    const result = getSafeHeight(databaseEntries, MIN_TIMESTAMP)

    expect(result).toEqual(MIN_TIMESTAMP.toNumber())
  })

  it('return minTimestamp if earliestLastSyncedTimestamp is before minTimestamp', () => {
    const databaseEntries: TrackedTxsConfigRecord[] = [
      mockDatabaseEntry({
        lastSyncedTimestamp: MIN_TIMESTAMP.add(-5, 'hours'),
        untilTimestampExclusive: MIN_TIMESTAMP.add(-3, 'hours'),
      }),
      mockDatabaseEntry({
        lastSyncedTimestamp: MIN_TIMESTAMP.add(-10, 'hours'),
      }),
    ]

    const result = getSafeHeight(databaseEntries, MIN_TIMESTAMP)

    expect(result).toEqual(MIN_TIMESTAMP.toNumber())
  })

  it('returns earliestLastSyncedTimestamp', () => {
    const cases = [
      // sinceTimestampInclusive is earlier than lastSyncedTimestamp
      {
        entries: [
          mockDatabaseEntry({
            lastSyncedTimestamp: NOW.add(-5, 'hours'),
            untilTimestampExclusive: NOW.add(-3, 'hours'),
          }),
          mockDatabaseEntry({
            sinceTimestampInclusive: NOW.add(-20, 'days'),
            lastSyncedTimestamp: undefined,
          }),
        ],
        result: NOW.add(-20, 'days'),
      },
      // lastSyncedTimestamp is earlier than sinceTimestampInclusive
      {
        entries: [
          mockDatabaseEntry({
            lastSyncedTimestamp: NOW.add(-24, 'hours'),
            untilTimestampExclusive: NOW.add(-21, 'hours'),
          }),
          mockDatabaseEntry({
            sinceTimestampInclusive: NOW.add(-5, 'hours'),
            lastSyncedTimestamp: undefined,
          }),
        ],
        result: NOW.add(-24, 'hours'),
      },
    ]

    for (const { entries, result } of cases) {
      const safeHeight = getSafeHeight(entries, MIN_TIMESTAMP)
      expect(safeHeight).toEqual(result.toNumber())
    }
  })
})

function mockDatabaseEntry(
  entry?: Partial<TrackedTxsConfigRecord>,
): TrackedTxsConfigRecord {
  return mockObject<TrackedTxsConfigRecord>({
    untilTimestampExclusive: undefined,
    lastSyncedTimestamp: undefined,
    ...entry,
  })
}
