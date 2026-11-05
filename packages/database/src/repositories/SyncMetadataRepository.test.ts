import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type SyncMetadataRecord,
  SyncMetadataRepository,
} from './SyncMetadataRepository'

describeDatabase(SyncMetadataRepository.name, (db) => {
  const repository = db.syncMetadata

  const now = UnixTime.now()
  const roundedHour = UnixTime.toStartOf(now, 'hour')

  afterEach(async () => {
    await repository.deleteAll()
  })

  describe(SyncMetadataRepository.prototype.upsertMany.name, () => {
    it('should insert new rows and update existing ones', async () => {
      const records: SyncMetadataRecord[] = [
        {
          feature: 'activity',
          id: 'arbitrum',
          target: roundedHour - UnixTime.HOUR,
          syncedUntil: roundedHour - UnixTime.HOUR,
          blockTarget: 200,
          blockSyncedUntil: 100,
          latestBlockTimestamp: null,
        },
        {
          feature: 'l2costs',
          id: 'base',
          target: roundedHour,
          syncedUntil: roundedHour,
          blockTarget: 100,
          blockSyncedUntil: 100,
          latestBlockTimestamp: null,
        },
      ]
      await repository.upsertMany(records)

      const results = await repository.getAll()
      expect(results).toEqualUnsorted(records)

      await repository.upsertMany([
        {
          feature: 'activity',
          id: 'arbitrum',
          target: roundedHour + UnixTime.HOUR,
          syncedUntil: roundedHour,
          blockTarget: 225,
          blockSyncedUntil: 200,
          latestBlockTimestamp: null,
        },
      ])

      const results2 = await repository.getAll()
      expect(results2).toEqualUnsorted([
        {
          feature: 'l2costs',
          id: 'base',
          target: roundedHour,
          syncedUntil: roundedHour,
          blockTarget: 100,
          blockSyncedUntil: 100,
          latestBlockTimestamp: null,
        },
        {
          feature: 'activity',
          id: 'arbitrum',
          target: roundedHour + UnixTime.HOUR,
          syncedUntil: roundedHour,
          blockTarget: 225,
          blockSyncedUntil: 200,
          latestBlockTimestamp: null,
        },
      ])
    })

    it('should update specified fields', async () => {
      await repository.upsertMany([
        {
          feature: 'activity',
          id: 'arbitrum',
          target: roundedHour,
          blockTarget: 100,
          syncedUntil: roundedHour - UnixTime.HOUR,
          blockSyncedUntil: 99,
          latestBlockTimestamp: null,
        },
      ])

      const results = await repository.getAll()
      expect(results).toEqual([
        {
          feature: 'activity',
          id: 'arbitrum',
          target: roundedHour,
          blockTarget: 100,
          syncedUntil: roundedHour - UnixTime.HOUR,
          blockSyncedUntil: 99,
          latestBlockTimestamp: null,
        },
      ])

      await repository.upsertMany([
        {
          feature: 'activity',
          id: 'arbitrum',
          target: roundedHour + UnixTime.HOUR,
          blockTarget: 110,
        },
      ])

      const results2 = await repository.getAll()
      expect(results2).toEqualUnsorted([
        {
          feature: 'activity',
          id: 'arbitrum',
          target: roundedHour + UnixTime.HOUR,
          blockTarget: 110,
          syncedUntil: roundedHour - UnixTime.HOUR,
          blockSyncedUntil: 99,
          latestBlockTimestamp: null,
        },
      ])
    })

    it('empty array not to be rejected', async () => {
      await expect(repository.upsertMany([])).not.toBeRejected()
    })
  })

  describe(SyncMetadataRepository.prototype.markEnded.name, () => {
    const end = roundedHour - 30 * UnixTime.DAY

    function tvs(
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
        latestBlockTimestamp: null,
      }
    }

    it('moves target to the end and caps syncedUntil there', async () => {
      await repository.upsertMany([
        // Values past the end were deleted, syncedUntil stayed
        tvs('trimmed-ETH', end + 10 * UnixTime.DAY, end + 10 * UnixTime.DAY),
        tvs('stopped-at-end-ETH', end + UnixTime.DAY, end),
        tvs('stopped-early-ETH', end + UnixTime.DAY, end - UnixTime.HOUR),
        tvs('never-synced-ETH', end + UnixTime.DAY, null),
      ])

      const updated = await repository.markEnded('tvs', [
        { id: 'trimmed-ETH', end },
        { id: 'stopped-at-end-ETH', end },
        { id: 'stopped-early-ETH', end },
        { id: 'never-synced-ETH', end },
      ])

      expect(updated).toEqual(4)
      expect(await repository.getAll()).toEqualUnsorted([
        tvs('trimmed-ETH', end, end),
        tvs('stopped-at-end-ETH', end, end),
        tvs('stopped-early-ETH', end, end - UnixTime.HOUR),
        tvs('never-synced-ETH', end, null),
      ])
    })

    it('skips rows that already match', async () => {
      await repository.upsertMany([tvs('trimmed-ETH', end, end)])

      const updated = await repository.markEnded('tvs', [
        { id: 'trimmed-ETH', end },
      ])

      expect(updated).toEqual(0)
    })

    it('does not insert rows or touch other features', async () => {
      const activity: SyncMetadataRecord = {
        ...tvs('trimmed-ETH', roundedHour, roundedHour),
        feature: 'activity',
      }
      await repository.upsertMany([activity])

      const updated = await repository.markEnded('tvs', [
        { id: 'trimmed-ETH', end },
      ])

      expect(updated).toEqual(0)
      expect(await repository.getAll()).toEqual([activity])
    })

    it('empty array not to be rejected', async () => {
      await expect(repository.markEnded('tvs', [])).not.toBeRejected()
    })
  })

  describe(SyncMetadataRepository.prototype.getByFeature.name, () => {
    it('returns all records for the feature and excludes other features', async () => {
      const records: SyncMetadataRecord[] = [
        {
          feature: 'activity',
          id: 'arbitrum',
          target: roundedHour,
          syncedUntil: roundedHour,
          blockTarget: 200,
          blockSyncedUntil: 100,
          latestBlockTimestamp: null,
        },
        {
          feature: 'activity',
          id: 'base',
          target: roundedHour + UnixTime.HOUR,
          syncedUntil: roundedHour + UnixTime.HOUR,
          blockTarget: 100,
          blockSyncedUntil: 100,
          latestBlockTimestamp: null,
        },
        {
          feature: 'l2costs',
          id: 'base',
          target: roundedHour + 2 * UnixTime.HOUR,
          syncedUntil: roundedHour + 2 * UnixTime.HOUR,
          blockTarget: 300,
          blockSyncedUntil: 200,
          latestBlockTimestamp: null,
        },
      ]
      await repository.upsertMany(records)

      const result = await repository.getByFeature('activity')
      expect(result).toEqualUnsorted(
        records.filter((r) => r.feature === 'activity'),
      )
    })

    it('returns empty array when no records exist for the feature', async () => {
      await repository.upsertMany([
        {
          feature: 'l2costs',
          id: 'base',
          target: roundedHour,
          syncedUntil: roundedHour,
          blockTarget: 100,
          blockSyncedUntil: 100,
          latestBlockTimestamp: null,
        },
      ])

      const result = await repository.getByFeature('activity')
      expect(result).toEqual([])
    })
  })

  describe(SyncMetadataRepository.prototype.getByFeatureAndId.name, () => {
    it('should return record for existing feature and id', async () => {
      const records: SyncMetadataRecord[] = [
        {
          feature: 'activity',
          id: 'arbitrum',
          target: roundedHour,
          syncedUntil: roundedHour,
          blockTarget: 200,
          blockSyncedUntil: 100,
          latestBlockTimestamp: null,
        },
        {
          feature: 'l2costs',
          id: 'base',
          target: roundedHour + UnixTime.HOUR,
          syncedUntil: roundedHour + UnixTime.HOUR,
          blockTarget: 100,
          blockSyncedUntil: 100,
          latestBlockTimestamp: null,
        },
      ]
      await repository.upsertMany(records)

      const result = await repository.getByFeatureAndId('activity', 'arbitrum')
      expect(result).toEqual(records[0])
    })

    it('should return undefined for non-existing feature and id', async () => {
      const result = await repository.getByFeatureAndId(
        'activity',
        'nonexistent',
      )
      expect(result).toEqual(undefined)
    })

    it('should return undefined for existing feature but non-existing id', async () => {
      const record: SyncMetadataRecord = {
        feature: 'activity',
        id: 'arbitrum',
        target: roundedHour,
        syncedUntil: roundedHour,
        blockTarget: 200,
        blockSyncedUntil: 100,
        latestBlockTimestamp: null,
      }
      await repository.upsertMany([record])

      const result = await repository.getByFeatureAndId(
        'activity',
        'nonexistent',
      )
      expect(result).toEqual(undefined)
    })
  })

  describe(SyncMetadataRepository.prototype.getByFeatureAndIds.name, () => {
    it('should return records for existing feature and ids', async () => {
      const records = [
        {
          feature: 'activity',
          id: 'arbitrum',
          target: roundedHour,
          syncedUntil: roundedHour,
          blockTarget: 200,
          blockSyncedUntil: 100,
          latestBlockTimestamp: null,
        },
        {
          feature: 'activity',
          id: 'base',
          target: roundedHour + UnixTime.HOUR,
          syncedUntil: roundedHour + UnixTime.HOUR,
          blockTarget: 100,
          blockSyncedUntil: 100,
          latestBlockTimestamp: null,
        },
        {
          feature: 'l2costs',
          id: 'arbitrum',
          target: roundedHour + 2 * UnixTime.HOUR,
          syncedUntil: roundedHour + 2 * UnixTime.HOUR,
          blockTarget: 300,
          blockSyncedUntil: 200,
          latestBlockTimestamp: null,
        },
      ] as const satisfies SyncMetadataRecord[]
      await repository.upsertMany(records)

      const results = await repository.getByFeatureAndIds('activity', [
        'arbitrum',
        'base',
      ])
      expect(results).toEqualUnsorted([records[0], records[1]])
    })

    it('should return empty array for existing feature but non-existing ids', async () => {
      const record: SyncMetadataRecord = {
        feature: 'activity',
        id: 'arbitrum',
        target: roundedHour,
        syncedUntil: roundedHour,
        blockTarget: 200,
        blockSyncedUntil: 100,
        latestBlockTimestamp: null,
      }
      await repository.upsertMany([record])

      const results = await repository.getByFeatureAndIds('activity', [
        'nonexistent1',
        'nonexistent2',
      ])
      expect(results).toEqual([])
    })

    it('should return empty array for empty ids array', async () => {
      const record: SyncMetadataRecord = {
        feature: 'activity',
        id: 'arbitrum',
        target: roundedHour,
        syncedUntil: roundedHour,
        blockTarget: 200,
        blockSyncedUntil: 100,
        latestBlockTimestamp: null,
      }
      await repository.upsertMany([record])

      const results = await repository.getByFeatureAndIds('activity', [])
      expect(results).toEqual([])
    })
  })

  describe(SyncMetadataRepository.prototype.getMaxTargetForFeature.name, () => {
    it('should return max target for feature', async () => {
      const records: SyncMetadataRecord[] = [
        {
          feature: 'activity',
          id: 'arbitrum',
          target: roundedHour,
          syncedUntil: roundedHour,
          blockTarget: 200,
          blockSyncedUntil: 100,
          latestBlockTimestamp: null,
        },
        {
          feature: 'activity',
          id: 'base',
          target: roundedHour + UnixTime.HOUR,
          syncedUntil: roundedHour + UnixTime.HOUR,
          blockTarget: 100,
          blockSyncedUntil: 100,
          latestBlockTimestamp: null,
        },
        {
          feature: 'activity',
          id: 'dydx',
          target: roundedHour + 2 * UnixTime.HOUR,
          syncedUntil: roundedHour + 2 * UnixTime.HOUR,
          blockTarget: 300,
          blockSyncedUntil: 200,
          latestBlockTimestamp: null,
        },
        {
          feature: 'l2costs',
          id: 'arbitrum',
          target: roundedHour + 3 * UnixTime.HOUR,
          syncedUntil: roundedHour + 3 * UnixTime.HOUR,
          blockTarget: 400,
          blockSyncedUntil: 300,
          latestBlockTimestamp: null,
        },
      ]
      await repository.upsertMany(records)

      const maxTarget = await repository.getMaxTargetForFeature('activity')
      expect(maxTarget).toEqual(roundedHour + 2 * UnixTime.HOUR)
    })

    it('should return undefined for non-existing feature', async () => {
      const maxTarget = await repository.getMaxTargetForFeature(
        'nonexistent' as any,
      )
      expect(maxTarget).toEqual(undefined)
    })
  })

  describe(SyncMetadataRepository.prototype.updateSyncedUntil.name, () => {
    it('should update syncedUntil for existing record', async () => {
      const records: SyncMetadataRecord[] = [
        {
          feature: 'activity',
          id: 'arbitrum',
          target: roundedHour,
          syncedUntil: roundedHour,
          blockTarget: 200,
          blockSyncedUntil: 100,
          latestBlockTimestamp: null,
        },
        {
          feature: 'activity',
          id: 'base',
          target: roundedHour + UnixTime.HOUR,
          syncedUntil: roundedHour + UnixTime.HOUR,
          blockTarget: 100,
          blockSyncedUntil: 100,
          latestBlockTimestamp: null,
        },
        {
          feature: 'activity',
          id: 'dydx',
          target: roundedHour + 2 * UnixTime.HOUR,
          syncedUntil: roundedHour + 2 * UnixTime.HOUR,
          blockTarget: 200,
          blockSyncedUntil: 100,
          latestBlockTimestamp: null,
        },
        {
          feature: 'l2costs',
          id: 'base',
          target: roundedHour + UnixTime.HOUR,
          syncedUntil: roundedHour + UnixTime.HOUR,
          blockTarget: 100,
          blockSyncedUntil: 100,
          latestBlockTimestamp: null,
        },
      ]
      await repository.upsertMany(records)

      const newSyncedUntil = roundedHour + 3 * UnixTime.HOUR
      await repository.updateSyncedUntil(
        'activity',
        ['arbitrum'],
        newSyncedUntil,
      )

      const results = await repository.getAll()

      expect(results).toHaveLength(4)
      expect(results).toEqualUnsorted([
        {
          feature: 'activity',
          id: 'base',
          target: roundedHour + UnixTime.HOUR,
          syncedUntil: roundedHour + UnixTime.HOUR,
          blockTarget: 100,
          blockSyncedUntil: 100,
          latestBlockTimestamp: null,
        },
        {
          feature: 'activity',
          id: 'dydx',
          target: roundedHour + 2 * UnixTime.HOUR,
          syncedUntil: roundedHour + 2 * UnixTime.HOUR,
          blockTarget: 200,
          blockSyncedUntil: 100,
          latestBlockTimestamp: null,
        },
        {
          feature: 'l2costs',
          id: 'base',
          target: roundedHour + UnixTime.HOUR,
          syncedUntil: roundedHour + UnixTime.HOUR,
          blockTarget: 100,
          blockSyncedUntil: 100,
          latestBlockTimestamp: null,
        },
        {
          feature: 'activity',
          id: 'arbitrum',
          target: roundedHour,
          syncedUntil: newSyncedUntil,
          blockTarget: 200,
          blockSyncedUntil: 100,
          latestBlockTimestamp: null,
        },
      ])
    })

    it('should update syncedUntil and blockSyncedUntil for existing record', async () => {
      const records: SyncMetadataRecord[] = [
        {
          feature: 'activity',
          id: 'arbitrum',
          target: roundedHour,
          syncedUntil: roundedHour,
          blockTarget: 1000,
          blockSyncedUntil: 100,
          latestBlockTimestamp: null,
        },
        {
          feature: 'activity',
          id: 'base',
          target: roundedHour + UnixTime.HOUR,
          syncedUntil: roundedHour + UnixTime.HOUR,
          blockTarget: 100,
          blockSyncedUntil: 100,
          latestBlockTimestamp: null,
        },
        {
          feature: 'activity',
          id: 'dydx',
          target: roundedHour + 2 * UnixTime.HOUR,
          syncedUntil: roundedHour + 2 * UnixTime.HOUR,
          blockTarget: 200,
          blockSyncedUntil: 100,
          latestBlockTimestamp: null,
        },
        {
          feature: 'l2costs',
          id: 'base',
          target: roundedHour + UnixTime.HOUR,
          syncedUntil: roundedHour + UnixTime.HOUR,
          blockTarget: 100,
          blockSyncedUntil: 100,
          latestBlockTimestamp: null,
        },
      ]
      await repository.upsertMany(records)

      const newSyncedUntil = roundedHour + 3 * UnixTime.HOUR
      const newBlockSyncedUntil = 999
      await repository.updateSyncedUntil(
        'activity',
        ['arbitrum'],
        newSyncedUntil,
        newBlockSyncedUntil,
      )

      const results = await repository.getAll()

      expect(results).toHaveLength(4)
      expect(results).toEqualUnsorted([
        {
          feature: 'activity',
          id: 'base',
          target: roundedHour + UnixTime.HOUR,
          syncedUntil: roundedHour + UnixTime.HOUR,
          blockTarget: 100,
          blockSyncedUntil: 100,
          latestBlockTimestamp: null,
        },
        {
          feature: 'activity',
          id: 'dydx',
          target: roundedHour + 2 * UnixTime.HOUR,
          syncedUntil: roundedHour + 2 * UnixTime.HOUR,
          blockTarget: 200,
          blockSyncedUntil: 100,
          latestBlockTimestamp: null,
        },
        {
          feature: 'l2costs',
          id: 'base',
          target: roundedHour + UnixTime.HOUR,
          syncedUntil: roundedHour + UnixTime.HOUR,
          blockTarget: 100,
          blockSyncedUntil: 100,
          latestBlockTimestamp: null,
        },
        {
          feature: 'activity',
          id: 'arbitrum',
          target: roundedHour,
          syncedUntil: newSyncedUntil,
          blockTarget: 1000,
          blockSyncedUntil: newBlockSyncedUntil,
          latestBlockTimestamp: null,
        },
      ])
    })

    it('should not update anything when ids array is empty', async () => {
      const records: SyncMetadataRecord[] = [
        {
          feature: 'activity',
          id: 'arbitrum',
          target: roundedHour,
          syncedUntil: roundedHour,
          blockTarget: 200,
          blockSyncedUntil: 100,
          latestBlockTimestamp: null,
        },
      ]
      await repository.upsertMany(records)

      const newSyncedUntil = roundedHour + UnixTime.HOUR
      await repository.updateSyncedUntil('activity', [], newSyncedUntil)

      const results = await repository.getAll()
      expect(results).toEqual(records)
    })
  })

  describe('latestBlockTimestamp', () => {
    // The live Ethereum surfaces read how far the counts go from it, so the
    // hourly target ticks must keep it and only an invalidation may clear it
    const record: SyncMetadataRecord = {
      feature: 'activity',
      id: 'ethereum',
      target: roundedHour,
      syncedUntil: roundedHour,
      blockTarget: 200,
      blockSyncedUntil: 100,
      latestBlockTimestamp: null,
    }

    it('is written with syncedUntil and kept by later target upserts', async () => {
      await repository.upsertMany([record])

      await repository.updateSyncedUntil(
        'activity',
        ['ethereum'],
        roundedHour + UnixTime.HOUR,
        150,
        roundedHour + 123,
      )
      await repository.upsertMany([{ ...record, blockTarget: 300 }])

      const result = await repository.getByFeatureAndId('activity', 'ethereum')
      expect(result?.latestBlockTimestamp).toEqual(roundedHour + 123)
      expect(result?.blockTarget).toEqual(300)
    })

    it('is kept when syncedUntil is updated without it', async () => {
      await repository.upsertMany([
        { ...record, latestBlockTimestamp: roundedHour + 1 },
      ])

      await repository.updateSyncedUntil(
        'activity',
        ['ethereum'],
        roundedHour + UnixTime.HOUR,
        150,
      )

      const result = await repository.getByFeatureAndId('activity', 'ethereum')
      expect(result?.latestBlockTimestamp).toEqual(roundedHour + 1)
    })

    it('is cleared for the given project only', async () => {
      await repository.upsertMany([
        { ...record, latestBlockTimestamp: roundedHour + 1 },
        { ...record, id: 'arbitrum', latestBlockTimestamp: roundedHour + 2 },
      ])

      await repository.clearLatestBlockTimestamp('activity', 'ethereum')

      const results = await repository.getByFeature('activity')
      expect(
        results.map((r) => [r.id, r.latestBlockTimestamp]),
      ).toEqualUnsorted([
        ['ethereum', null],
        ['arbitrum', roundedHour + 2],
      ])
    })
  })
})
