import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type InteropPluginConfigRecord,
  InteropPluginConfigRepository,
  type InteropPluginSyncedBlockRanges,
} from './InteropPluginConfigRepository'

describeDatabase(InteropPluginConfigRepository.name, (db) => {
  const repository = db.interopPluginConfig

  afterEach(async () => {
    await repository.deleteAll()
  })

  describe(InteropPluginConfigRepository.prototype.insert.name, () => {
    it('inserts record with optional fields', async () => {
      const record = config({
        pluginName: 'plugin-a',
        syncedBlockRanges: ranges({
          ethereum: { syncedFrom: 1, syncedTo: 10 },
          arbitrum: { syncedFrom: 5, syncedTo: 50 },
        }),
        resyncRequestedFrom: UnixTime(123),
      })

      await repository.insert(record)

      const stored = await repository.findByPluginName(record.pluginName)
      expect(stored).toEqual(record)
    })

    it('accepts null optional fields', async () => {
      const record = config({
        pluginName: 'plugin-a',
        syncedBlockRanges: null,
        resyncRequestedFrom: null,
      })

      await repository.insert(record)

      const stored = await repository.findByPluginName(record.pluginName)
      expect(stored).toEqual(record)
    })

    it('throws error when inserting duplicate pluginName', async () => {
      const record = config({ pluginName: 'plugin-a' })

      await repository.insert(record)

      await expect(repository.insert(record)).toBeRejected()
    })
  })

  describe(
    InteropPluginConfigRepository.prototype.updateByPluginName.name,
    () => {
      it('updates record and returns number of affected rows', async () => {
        const record = config({
          pluginName: 'plugin-a',
          syncedBlockRanges: ranges({
            ethereum: { syncedFrom: 1, syncedTo: 10 },
          }),
          resyncRequestedFrom: UnixTime(100),
        })
        await repository.insert(record)

        const updated = await repository.updateByPluginName(record.pluginName, {
          syncedBlockRanges: ranges({
            ethereum: { syncedFrom: 5, syncedTo: 50 },
            optimism: { syncedFrom: 7, syncedTo: 70 },
          }),
          resyncRequestedFrom: null,
        })

        expect(updated).toEqual(1)

        const stored = await repository.findByPluginName(record.pluginName)
        expect(stored).toEqual({
          ...record,
          syncedBlockRanges: ranges({
            ethereum: { syncedFrom: 5, syncedTo: 50 },
            optimism: { syncedFrom: 7, syncedTo: 70 },
          }),
          resyncRequestedFrom: null,
        })
      })

      it('returns 0 when plugin does not exist', async () => {
        const updated = await repository.updateByPluginName('missing', {
          resyncRequestedFrom: UnixTime(1),
        })

        expect(updated).toEqual(0)
      })
    },
  )

  describe(InteropPluginConfigRepository.prototype.getAll.name, () => {
    it('returns all records', async () => {
      const a = config({ pluginName: 'plugin-a' })
      const b = config({
        pluginName: 'plugin-b',
        syncedBlockRanges: ranges({
          ethereum: { syncedFrom: 1, syncedTo: 10 },
        }),
      })

      await repository.insert(a)
      await repository.insert(b)

      const all = await repository.getAll()
      expect(all).toEqualUnsorted([a, b])
    })
  })
})

function config(
  overrides: Partial<InteropPluginConfigRecord> & { pluginName: string },
): InteropPluginConfigRecord {
  return {
    pluginName: overrides.pluginName,
    syncedBlockRanges: overrides.syncedBlockRanges ?? null,
    resyncRequestedFrom: overrides.resyncRequestedFrom ?? null,
  }
}

function ranges(
  value: InteropPluginSyncedBlockRanges,
): InteropPluginSyncedBlockRanges {
  return value
}
