import type { Database, SyncMetadataRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import {
  getSyncedTvsTimestamp,
  getTvsSyncMetadata,
} from './getSyncedTvsTimestamp'
import { getTvsTargetTimestamp } from './getTvsTargetTimestamp'

const HOUR = UnixTime.HOUR
const NOW_HOUR = UnixTime.toStartOf(UnixTime.now(), 'hour')
const TARGET = NOW_HOUR - HOUR

describe(getSyncedTvsTimestamp.name, () => {
  it('returns the earliest hour synced by the tokens', () => {
    const records = [
      record('arbitrum-ETH', TARGET, TARGET),
      record('arbitrum-USDC', TARGET, TARGET - HOUR),
    ]

    const result = getSyncedTvsTimestamp(records, tokens(records))

    expect(result).toEqual(TARGET - HOUR)
  })

  it('reads only the listed tokens', () => {
    const records = [
      record('arbitrum-ETH', TARGET, TARGET),
      record('base-ETH', TARGET, TARGET - 2 * HOUR),
    ]

    const result = getSyncedTvsTimestamp(records, [{ id: 'arbitrum-ETH' }])

    expect(result).toEqual(TARGET)
  })

  it('shares one hour across projects, skipping stale ones', () => {
    const records = [
      record('arbitrum-ETH', TARGET, TARGET),
      record('base-ETH', TARGET, TARGET - HOUR),
      // Behind past the isTvsSynced cutoff, flagged as unsynced elsewhere
      record('stuck-ETH', TARGET, NOW_HOUR - 7 * HOUR),
    ]

    const result = getSyncedTvsTimestamp(records, tokens(records))

    expect(result).toEqual(TARGET - HOUR)
  })

  it('skips tokens the backend no longer targets', () => {
    const records = [
      record('arbitrum-ETH', TARGET, TARGET),
      // untilTimestamp passed, so the hourly tick stopped advancing the row
      record('arbitrum-OLD', TARGET - 2 * HOUR, TARGET - 2 * HOUR),
    ]

    const result = getSyncedTvsTimestamp(records, tokens(records))

    expect(result).toEqual(TARGET)
  })

  it('skips tokens that never synced', () => {
    const records = [
      record('arbitrum-ETH', TARGET, TARGET),
      record('arbitrum-NEW', TARGET, null),
    ]

    const result = getSyncedTvsTimestamp(records, tokens(records))

    expect(result).toEqual(TARGET)
  })

  it('falls back to the wall clock without rows', () => {
    const result = getSyncedTvsTimestamp([], [{ id: 'arbitrum-ETH' }])

    expect(result).toEqual(getTvsTargetTimestamp())
  })

  it('falls back to the wall clock when every row is stale or unsynced', () => {
    const records = [
      record('arbitrum-ETH', TARGET, NOW_HOUR - 7 * HOUR),
      record('arbitrum-NEW', TARGET, null),
    ]

    const result = getSyncedTvsTimestamp(records, tokens(records))

    expect(result).toEqual(getTvsTargetTimestamp())
  })
})

describe(getTvsSyncMetadata.name, () => {
  it('shares one query between concurrent callers', async () => {
    const records = [record('arbitrum-ETH', TARGET, TARGET)]
    const repository = mockObject<Database['syncMetadata']>({
      getByFeature: mockFn().resolvesTo(records),
    })

    const results = await Promise.all([
      getTvsSyncMetadata(repository),
      getTvsSyncMetadata(repository),
    ])

    expect(results).toEqual([records, records])
    expect(repository.getByFeature).toHaveBeenOnlyCalledWith('tvs')
  })

  it('queries again once the previous query settled', async () => {
    const repository = mockObject<Database['syncMetadata']>({
      getByFeature: mockFn().resolvesTo([]),
    })

    await getTvsSyncMetadata(repository)
    await getTvsSyncMetadata(repository)

    expect(repository.getByFeature).toHaveBeenCalledTimes(2)
  })
})

function record(
  id: string,
  target: UnixTime,
  syncedUntil: UnixTime | null,
): SyncMetadataRecord {
  return {
    feature: 'tvs',
    id,
    target,
    syncedUntil,
    blockTarget: null,
    blockSyncedUntil: null,
  }
}

function tokens(records: SyncMetadataRecord[]) {
  return records.map((r) => ({ id: r.id }))
}
