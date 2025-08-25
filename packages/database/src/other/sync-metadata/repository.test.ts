import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../../test/database'
import type { SyncMetadataRecord } from './entity'
import { SyncMetadataRepository } from './repository'

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
          target: roundedHour - 1 * UnixTime.HOUR,
          syncedUntil: roundedHour - 1 * UnixTime.HOUR,
        },
        {
          feature: 'l2Cost',
          id: 'base',
          target: roundedHour,
          syncedUntil: roundedHour,
        },
      ]
      await repository.upsertMany(records)

      const results = await repository.getAll()
      expect(results).toEqualUnsorted(records)

      await repository.upsertMany([
        {
          feature: 'activity',
          id: 'arbitrum',
          target: roundedHour + 1 * UnixTime.HOUR,
          syncedUntil: roundedHour,
        },
      ])

      const results2 = await repository.getAll()
      expect(results2).toEqualUnsorted([
        {
          feature: 'l2Cost',
          id: 'base',
          target: roundedHour,
          syncedUntil: roundedHour,
        },
        {
          feature: 'activity',
          id: 'arbitrum',
          target: roundedHour + 1 * UnixTime.HOUR,
          syncedUntil: roundedHour,
        },
      ])
    })

    it('empty array not to be rejected', async () => {
      await expect(repository.upsertMany([])).not.toBeRejected()
    })
  })

  describe(SyncMetadataRepository.prototype.updateTarget.name, () => {
    it('should update target for existing record', async () => {
      const records: SyncMetadataRecord[] = [
        {
          feature: 'activity',
          id: 'arbitrum',
          target: roundedHour,
          syncedUntil: roundedHour,
        },
        {
          feature: 'l2Cost',
          id: 'base',
          target: roundedHour + 1 * UnixTime.HOUR,
          syncedUntil: roundedHour + 1 * UnixTime.HOUR,
        },
      ]
      await repository.upsertMany(records)

      const newTarget = roundedHour + 3 * UnixTime.HOUR
      await repository.updateTarget({
        feature: 'activity',
        id: 'arbitrum',
        target: newTarget,
      })

      const results = await repository.getAll()
      expect(results).toHaveLength(2)
      expect(results).toEqualUnsorted([
        {
          feature: 'activity',
          id: 'arbitrum',
          target: newTarget,
          syncedUntil: roundedHour,
        },
        {
          feature: 'l2Cost',
          id: 'base',
          target: roundedHour + 1 * UnixTime.HOUR,
          syncedUntil: roundedHour + 1 * UnixTime.HOUR,
        },
      ])
    })

    it('should not affect non-existent record', async () => {
      await repository.updateTarget({
        feature: 'activity',
        id: 'non-existent',
        target: roundedHour,
      })

      const results = await repository.getAll()
      expect(results).toHaveLength(0)
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
        },
        {
          feature: 'l2Cost',
          id: 'base',
          target: roundedHour + 1 * UnixTime.HOUR,
          syncedUntil: roundedHour + 1 * UnixTime.HOUR,
        },
      ]
      await repository.upsertMany(records)

      const newSyncedUntil = roundedHour + 3 * UnixTime.HOUR
      await repository.updateSyncedUntil({
        feature: 'activity',
        id: 'arbitrum',
        syncedUntil: newSyncedUntil,
      })

      const results = await repository.getAll()
      expect(results).toHaveLength(2)
      expect(results).toEqualUnsorted([
        {
          feature: 'activity',
          id: 'arbitrum',
          target: roundedHour,
          syncedUntil: newSyncedUntil,
        },
        {
          feature: 'l2Cost',
          id: 'base',
          target: roundedHour + 1 * UnixTime.HOUR,
          syncedUntil: roundedHour + 1 * UnixTime.HOUR,
        },
      ])
    })

    it('should not affect non-existent record', async () => {
      await repository.updateSyncedUntil({
        feature: 'activity',
        id: 'non-existent',
        syncedUntil: roundedHour,
      })

      const results = await repository.getAll()
      expect(results).toHaveLength(0)
    })
  })
})
