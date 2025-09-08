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
      expect(results).toEqualUnsorted(records.slice(0, 2))

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

    it('empty array not to be rejected', async () => {
      await expect(repository.upsertMany([])).not.toBeRejected()
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
