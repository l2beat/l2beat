import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { TrackedTxsConfigRecord } from '../../tracked-txs/repositories/TrackedTxsConfigsRepository'
import { getLivenessSyncedUntil } from './getLivenessSyncedUntil'

const FROM = UnixTime.fromDate(new Date('2022-01-01T00:00:00Z'))

describe(getLivenessSyncedUntil.name, () => {
  it('returns undefined if no configurations', () => {
    const result = getLivenessSyncedUntil([])
    expect(result).toEqual(undefined)
  })

  it('returns undefined if no lastSyncedTimestamp', () => {
    const result = getLivenessSyncedUntil([
      mockObject<TrackedTxsConfigRecord>({
        lastSyncedTimestamp: undefined,
        untilTimestampExclusive: undefined,
      }),
    ])

    expect(result).toEqual(undefined)
  })

  it('returns earliest lastSyncedTimestamp of configurations without untilTimestamp', () => {
    const result = getLivenessSyncedUntil([
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
    const result = getLivenessSyncedUntil([
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
