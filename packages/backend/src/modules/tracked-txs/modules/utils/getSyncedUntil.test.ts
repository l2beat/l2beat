import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { TrackedTxsConfigRecord } from '../../repositories/TrackedTxsConfigsRepository'
import { getSyncedUntil } from './getSyncedUntil'

const FROM = UnixTime.fromDate(new Date('2022-01-01T00:00:00Z'))

describe(getSyncedUntil.name, () => {
  it('returns undefined if no configurations', () => {
    const result = getSyncedUntil([])
    expect(result).toEqual(undefined)
  })

  it('returns undefined if no lastSyncedTimestamp', () => {
    const result = getSyncedUntil([
      mockObject<TrackedTxsConfigRecord>({
        lastSyncedTimestamp: undefined,
        untilTimestampExclusive: undefined,
      }),
    ])

    expect(result).toEqual(undefined)
  })

  it('returns earliest lastSyncedTimestamp of configurations without untilTimestamp', () => {
    const result = getSyncedUntil([
      mockObject<TrackedTxsConfigRecord>({
        lastSyncedTimestamp: undefined,
        untilTimestampExclusive: undefined,
      }),
      mockObject<TrackedTxsConfigRecord>({
        lastSyncedTimestamp: FROM,
        untilTimestampExclusive: undefined,
      }),
      mockObject<TrackedTxsConfigRecord>({
        lastSyncedTimestamp: FROM.add(2, 'hours'),
        untilTimestampExclusive: undefined,
      }),
    ])

    expect(result).toEqual(FROM)
  })

  it('returns earliest lastSyncedTimestamp of configurations with untilTimestamp', () => {
    const result = getSyncedUntil([
      mockObject<TrackedTxsConfigRecord>({
        lastSyncedTimestamp: undefined,
        untilTimestampExclusive: undefined,
      }),
      mockObject<TrackedTxsConfigRecord>({
        lastSyncedTimestamp: FROM.add(1, 'hours'),
        untilTimestampExclusive: FROM.add(5, 'hours'),
      }),
      mockObject<TrackedTxsConfigRecord>({
        lastSyncedTimestamp: FROM.add(2, 'hours'),
        untilTimestampExclusive: FROM.add(6, 'hours'),
      }),
      mockObject<TrackedTxsConfigRecord>({
        lastSyncedTimestamp: FROM.add(4, 'hours'),
        untilTimestampExclusive: FROM.add(6, 'hours'),
      }),
    ])

    expect(result).toEqual(FROM.add(1, 'hours'))
  })
})
