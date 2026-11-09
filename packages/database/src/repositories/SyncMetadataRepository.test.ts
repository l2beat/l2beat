import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type SyncMetadataRecord,
  SyncMetadataRepository,
} from './SyncMetadataRepository'

describeDatabase(SyncMetadataRepository.name, (db) => {
  const repository = db.syncMetadata

  const roundedHour = UnixTime.toStartOf(UnixTime.now(), 'hour')

  afterEach(async () => {
    await repository.deleteAll()
  })

  function record(
    record: Partial<SyncMetadataRecord> & Pick<SyncMetadataRecord, 'id'>,
  ): SyncMetadataRecord {
    return {
      feature: 'activity',
      target: roundedHour,
      syncedUntil: null,
      blockTarget: null,
      blockSyncedUntil: null,
      ...record,
    }
  }

  async function seed(...records: SyncMetadataRecord[]) {
    for (const r of records) {
      await repository.setTargets(r.feature, [
        { id: r.id, target: r.target, blockTarget: r.blockTarget ?? undefined },
      ])
      if (r.syncedUntil !== null) {
        await repository.updateSyncedUntil(
          r.feature,
          [r.id],
          r.syncedUntil,
          r.blockSyncedUntil ?? undefined,
        )
      }
    }
  }

  describe(SyncMetadataRepository.prototype.setTargets.name, () => {
    it('inserts new ids unsynced and moves targets of existing ones, keeping their progress', async () => {
      await seed(
        record({
          id: 'arbitrum',
          syncedUntil: roundedHour - UnixTime.HOUR,
          blockTarget: 200,
          blockSyncedUntil: 100,
        }),
      )

      await repository.setTargets('activity', [
        {
          id: 'arbitrum',
          target: roundedHour + UnixTime.HOUR,
          blockTarget: 225,
        },
        { id: 'base', target: roundedHour + UnixTime.HOUR },
      ])

      expect(await repository.getByFeature('activity')).toEqualUnsorted([
        record({
          id: 'arbitrum',
          target: roundedHour + UnixTime.HOUR,
          syncedUntil: roundedHour - UnixTime.HOUR,
          blockTarget: 225,
          blockSyncedUntil: 100,
        }),
        record({ id: 'base', target: roundedHour + UnixTime.HOUR }),
      ])
    })

    it('empty array not to be rejected', async () => {
      await expect(repository.setTargets('activity', [])).not.toBeRejected()
    })
  })

  describe(SyncMetadataRepository.prototype.updateSyncedUntil.name, () => {
    it('updates only the given ids of the feature', async () => {
      const untouched = [
        record({ id: 'base', syncedUntil: roundedHour, blockSyncedUntil: 50 }),
        record({
          feature: 'l2costs',
          id: 'arbitrum',
          syncedUntil: roundedHour,
        }),
      ]
      await seed(
        record({ id: 'arbitrum', syncedUntil: roundedHour, blockTarget: 1000 }),
        record({ id: 'dydx', syncedUntil: roundedHour, blockSyncedUntil: 7 }),
        ...untouched,
      )

      await repository.updateSyncedUntil(
        'activity',
        ['arbitrum'],
        roundedHour + UnixTime.HOUR,
        999,
      )
      await repository.updateSyncedUntil(
        'activity',
        ['dydx'],
        roundedHour + UnixTime.HOUR,
      )

      expect([
        ...(await repository.getByFeature('activity')),
        ...(await repository.getByFeature('l2costs')),
      ]).toEqualUnsorted([
        record({
          id: 'arbitrum',
          syncedUntil: roundedHour + UnixTime.HOUR,
          blockTarget: 1000,
          blockSyncedUntil: 999,
        }),
        record({
          id: 'dydx',
          syncedUntil: roundedHour + UnixTime.HOUR,
          blockSyncedUntil: 7,
        }),
        ...untouched,
      ])
    })

    it('does nothing for empty ids', async () => {
      const arbitrum = record({ id: 'arbitrum', syncedUntil: roundedHour })
      await seed(arbitrum)

      await repository.updateSyncedUntil(
        'activity',
        [],
        roundedHour + UnixTime.HOUR,
      )

      expect(await repository.getByFeature('activity')).toEqual([arbitrum])
    })
  })

  describe(SyncMetadataRepository.prototype.markEnded.name, () => {
    const end = roundedHour - 30 * UnixTime.DAY

    function tvs(id: string, target: UnixTime, syncedUntil: UnixTime | null) {
      return record({ feature: 'tvs', id, target, syncedUntil })
    }

    it('moves target to the end and caps syncedUntil there', async () => {
      await seed(
        // Values past the end were deleted, syncedUntil stayed
        tvs('trimmed-ETH', end + 10 * UnixTime.DAY, end + 10 * UnixTime.DAY),
        tvs('stopped-at-end-ETH', end + UnixTime.DAY, end),
        tvs('stopped-early-ETH', end + UnixTime.DAY, end - UnixTime.HOUR),
        tvs('never-synced-ETH', end + UnixTime.DAY, null),
      )

      const updated = await repository.markEnded('tvs', [
        { id: 'trimmed-ETH', end },
        { id: 'stopped-at-end-ETH', end },
        { id: 'stopped-early-ETH', end },
        { id: 'never-synced-ETH', end },
      ])

      expect(updated).toEqual(4)
      expect(await repository.getByFeature('tvs')).toEqualUnsorted([
        tvs('trimmed-ETH', end, end),
        tvs('stopped-at-end-ETH', end, end),
        tvs('stopped-early-ETH', end, end - UnixTime.HOUR),
        tvs('never-synced-ETH', end, null),
      ])
    })

    it('skips rows that already match', async () => {
      await seed(tvs('trimmed-ETH', end, end))

      const updated = await repository.markEnded('tvs', [
        { id: 'trimmed-ETH', end },
      ])

      expect(updated).toEqual(0)
    })

    it('does not insert rows or touch other features', async () => {
      const activity = record({ id: 'trimmed-ETH', syncedUntil: roundedHour })
      await seed(activity)

      const updated = await repository.markEnded('tvs', [
        { id: 'trimmed-ETH', end },
      ])

      expect(updated).toEqual(0)
      expect(await repository.getByFeature('tvs')).toEqual([])
      expect(await repository.getByFeature('activity')).toEqual([activity])
    })

    it('empty array not to be rejected', async () => {
      await expect(repository.markEnded('tvs', [])).not.toBeRejected()
    })
  })

  describe(SyncMetadataRepository.prototype.getByFeatureAndId.name, () => {
    it('returns the record of the feature and id', async () => {
      const arbitrum = record({ id: 'arbitrum', syncedUntil: roundedHour })
      await seed(arbitrum, record({ feature: 'l2costs', id: 'base' }))

      expect(
        await repository.getByFeatureAndId('activity', 'arbitrum'),
      ).toEqual(arbitrum)
      expect(await repository.getByFeatureAndId('activity', 'base')).toEqual(
        undefined,
      )
    })
  })

  describe(SyncMetadataRepository.prototype.getByFeatureAndIds.name, () => {
    it('returns the records of the feature and ids', async () => {
      const activity = [record({ id: 'arbitrum' }), record({ id: 'base' })]
      await seed(
        ...activity,
        record({ id: 'dydx' }),
        record({ feature: 'l2costs', id: 'arbitrum' }),
      )

      expect(
        await repository.getByFeatureAndIds('activity', ['arbitrum', 'base']),
      ).toEqualUnsorted(activity)
    })

    it('returns empty array for empty ids', async () => {
      await seed(record({ id: 'arbitrum' }))

      expect(await repository.getByFeatureAndIds('activity', [])).toEqual([])
    })
  })

  describe(SyncMetadataRepository.prototype.getMaxTargetForFeature.name, () => {
    it('returns the max target of the feature', async () => {
      await seed(
        record({ id: 'arbitrum', target: roundedHour }),
        record({ id: 'base', target: roundedHour + UnixTime.HOUR }),
        record({
          feature: 'l2costs',
          id: 'arbitrum',
          target: roundedHour + 2 * UnixTime.HOUR,
        }),
      )

      expect(await repository.getMaxTargetForFeature('activity')).toEqual(
        roundedHour + UnixTime.HOUR,
      )
    })

    it('returns undefined for a feature without records', async () => {
      expect(await repository.getMaxTargetForFeature('tvs')).toEqual(undefined)
    })
  })
})
