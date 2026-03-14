import type { IndexerConfigurationRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { getConfigurationsSyncedUntil } from './getConfigurationsSyncedUntil'

const FROM = UnixTime.fromDate(new Date('2022-01-01T00:00:00Z'))

describe(getConfigurationsSyncedUntil.name, () => {
  it('returns undefined if no configurations', () => {
    const result = getConfigurationsSyncedUntil([])
    expect(result).toEqual(undefined)
  })

  it('returns undefined if no lastSyncedTimestamp', () => {
    const result = getConfigurationsSyncedUntil([
      mockObject<IndexerConfigurationRecord>({
        currentHeight: null,
        maxHeight: null,
      }),
    ])

    expect(result).toEqual(undefined)
  })

  it('returns earliest lastSyncedTimestamp of configurations without untilTimestamp', () => {
    const result = getConfigurationsSyncedUntil([
      mockObject<IndexerConfigurationRecord>({
        currentHeight: null,
        maxHeight: null,
      }),
      mockObject<IndexerConfigurationRecord>({
        currentHeight: FROM,
        maxHeight: null,
      }),
      mockObject<IndexerConfigurationRecord>({
        currentHeight: FROM + 2 * UnixTime.HOUR,
        maxHeight: null,
      }),
    ])

    expect(result).toEqual(FROM)
  })

  it('returns earliest lastSyncedTimestamp of configurations with untilTimestamp', () => {
    const result = getConfigurationsSyncedUntil([
      mockObject<IndexerConfigurationRecord>({
        currentHeight: null,
        maxHeight: null,
      }),
      mockObject<IndexerConfigurationRecord>({
        currentHeight: FROM + 1 * UnixTime.HOUR,
        maxHeight: FROM + 5 * UnixTime.HOUR,
      }),
      mockObject<IndexerConfigurationRecord>({
        currentHeight: FROM + 2 * UnixTime.HOUR,
        maxHeight: FROM + 6 * UnixTime.HOUR,
      }),
      mockObject<IndexerConfigurationRecord>({
        currentHeight: FROM + 4 * UnixTime.HOUR,
        maxHeight: FROM + 6 * UnixTime.HOUR,
      }),
    ])

    expect(result).toEqual(FROM + 1 * UnixTime.HOUR)
  })
})
