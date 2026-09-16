import type { IndexerConfigurationRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { mockObject } from '@l2beat/test-utils'
import { describe, expect, it } from 'vitest'
import { getConfigurationsSyncedUntil } from './getConfigurationsSyncedUntil'

const FROM = UnixTime.fromDate(new Date('2022-01-01T00:00:00Z'))

describe(getConfigurationsSyncedUntil.name, () => {
  it('returns undefined if no configurations', () => {
    const result = getConfigurationsSyncedUntil([])
    expect(result).toStrictEqual(undefined)
  })

  it('returns undefined if no lastSyncedTimestamp', () => {
    const result = getConfigurationsSyncedUntil([
      mockObject<IndexerConfigurationRecord>({
        currentHeight: null,
        maxHeight: null,
      }),
    ])

    expect(result).toStrictEqual(undefined)
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

    expect(result).toStrictEqual(FROM)
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

    expect(result).toStrictEqual(FROM + 1 * UnixTime.HOUR)
  })
})
