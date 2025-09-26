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
        },
        {
          feature: 'l2costs',
          id: 'base',
          target: roundedHour,
          syncedUntil: roundedHour,
          blockTarget: 100,
          blockSyncedUntil: 100,
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
        },
        {
          feature: 'activity',
          id: 'arbitrum',
          target: roundedHour + UnixTime.HOUR,
          syncedUntil: roundedHour,
          blockTarget: 225,
          blockSyncedUntil: 200,
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
        },
      ])
    })

    it('empty array not to be rejected', async () => {
      await expect(repository.upsertMany([])).not.toBeRejected()
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
        },
        {
          feature: 'l2costs',
          id: 'base',
          target: roundedHour + UnixTime.HOUR,
          syncedUntil: roundedHour + UnixTime.HOUR,
          blockTarget: 100,
          blockSyncedUntil: 100,
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
        },
        {
          feature: 'activity',
          id: 'base',
          target: roundedHour + UnixTime.HOUR,
          syncedUntil: roundedHour + UnixTime.HOUR,
          blockTarget: 100,
          blockSyncedUntil: 100,
        },
        {
          feature: 'l2costs',
          id: 'arbitrum',
          target: roundedHour + 2 * UnixTime.HOUR,
          syncedUntil: roundedHour + 2 * UnixTime.HOUR,
          blockTarget: 300,
          blockSyncedUntil: 200,
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
      }
      await repository.upsertMany([record])

      const results = await repository.getByFeatureAndIds('activity', [
        'nonexistent1',
        'nonexistent2',
      ])
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
        },
        {
          feature: 'activity',
          id: 'base',
          target: roundedHour + UnixTime.HOUR,
          syncedUntil: roundedHour + UnixTime.HOUR,
          blockTarget: 100,
          blockSyncedUntil: 100,
        },
        {
          feature: 'activity',
          id: 'dydx',
          target: roundedHour + 2 * UnixTime.HOUR,
          syncedUntil: roundedHour + 2 * UnixTime.HOUR,
          blockTarget: 300,
          blockSyncedUntil: 200,
        },
        {
          feature: 'l2costs',
          id: 'arbitrum',
          target: roundedHour + 3 * UnixTime.HOUR,
          syncedUntil: roundedHour + 3 * UnixTime.HOUR,
          blockTarget: 400,
          blockSyncedUntil: 300,
        },
      ]
      await repository.upsertMany(records)

      const maxTarget = await repository.getMaxTargetForFeature('activity')
      expect(maxTarget).toEqual(roundedHour + 2 * UnixTime.HOUR)
    })

    it('should throw error for non-existing feature', async () => {
      await expect(
        repository.getMaxTargetForFeature('nonexistent' as any),
      ).toBeRejectedWith('Max target for feature not found')
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
        },
        {
          feature: 'activity',
          id: 'base',
          target: roundedHour + UnixTime.HOUR,
          syncedUntil: roundedHour + UnixTime.HOUR,
          blockTarget: 100,
          blockSyncedUntil: 100,
        },
        {
          feature: 'activity',
          id: 'dydx',
          target: roundedHour + 2 * UnixTime.HOUR,
          syncedUntil: roundedHour + 2 * UnixTime.HOUR,
          blockTarget: 200,
          blockSyncedUntil: 100,
        },
        {
          feature: 'l2costs',
          id: 'base',
          target: roundedHour + UnixTime.HOUR,
          syncedUntil: roundedHour + UnixTime.HOUR,
          blockTarget: 100,
          blockSyncedUntil: 100,
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
        },
        {
          feature: 'activity',
          id: 'dydx',
          target: roundedHour + 2 * UnixTime.HOUR,
          syncedUntil: roundedHour + 2 * UnixTime.HOUR,
          blockTarget: 200,
          blockSyncedUntil: 100,
        },
        {
          feature: 'l2costs',
          id: 'base',
          target: roundedHour + UnixTime.HOUR,
          syncedUntil: roundedHour + UnixTime.HOUR,
          blockTarget: 100,
          blockSyncedUntil: 100,
        },
        {
          feature: 'activity',
          id: 'arbitrum',
          target: roundedHour,
          syncedUntil: newSyncedUntil,
          blockTarget: 200,
          blockSyncedUntil: 100,
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
        },
        {
          feature: 'activity',
          id: 'base',
          target: roundedHour + UnixTime.HOUR,
          syncedUntil: roundedHour + UnixTime.HOUR,
          blockTarget: 100,
          blockSyncedUntil: 100,
        },
        {
          feature: 'activity',
          id: 'dydx',
          target: roundedHour + 2 * UnixTime.HOUR,
          syncedUntil: roundedHour + 2 * UnixTime.HOUR,
          blockTarget: 200,
          blockSyncedUntil: 100,
        },
        {
          feature: 'l2costs',
          id: 'base',
          target: roundedHour + UnixTime.HOUR,
          syncedUntil: roundedHour + UnixTime.HOUR,
          blockTarget: 100,
          blockSyncedUntil: 100,
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
        },
        {
          feature: 'activity',
          id: 'dydx',
          target: roundedHour + 2 * UnixTime.HOUR,
          syncedUntil: roundedHour + 2 * UnixTime.HOUR,
          blockTarget: 200,
          blockSyncedUntil: 100,
        },
        {
          feature: 'l2costs',
          id: 'base',
          target: roundedHour + UnixTime.HOUR,
          syncedUntil: roundedHour + UnixTime.HOUR,
          blockTarget: 100,
          blockSyncedUntil: 100,
        },
        {
          feature: 'activity',
          id: 'arbitrum',
          target: roundedHour,
          syncedUntil: newSyncedUntil,
          blockTarget: 1000,
          blockSyncedUntil: newBlockSyncedUntil,
        },
      ])
    })
  })
})
