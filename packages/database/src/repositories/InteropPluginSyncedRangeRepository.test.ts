import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type InteropPluginSyncedRangeRecord,
  InteropPluginSyncedRangeRepository,
} from './InteropPluginSyncedRangeRepository'

describeDatabase(InteropPluginSyncedRangeRepository.name, (db) => {
  const repository = db.interopPluginSyncedRange
  const statusRepository = db.interopPluginStatus

  afterEach(async () => {
    await repository.deleteAll()
    await statusRepository.deleteAll()
  })

  describe(InteropPluginSyncedRangeRepository.prototype.upsert.name, () => {
    it('inserts new record', async () => {
      await insertPlugins(['plugin-a'])
      const record = range({ pluginName: 'plugin-a', chain: 'ethereum' })

      await repository.upsert(record)

      const all = await repository.getAll()
      expect(all).toEqual([record])
    })

    it('updates record for the same plugin and chain', async () => {
      await insertPlugins(['plugin-a'])
      const record = range({
        pluginName: 'plugin-a',
        chain: 'ethereum',
        fromBlock: 1n,
        fromTimestamp: UnixTime(100),
        toBlock: 2n,
        toTimestamp: UnixTime(200),
      })
      await repository.upsert(record)

      const updated = range({
        pluginName: 'plugin-a',
        chain: 'ethereum',
        fromBlock: 10n,
        fromTimestamp: UnixTime(1000),
        toBlock: 20n,
        toTimestamp: UnixTime(2000),
      })
      await repository.upsert(updated)

      const all = await repository.getAll()
      expect(all).toEqual([updated])
    })
  })

  describe(
    InteropPluginSyncedRangeRepository.prototype.deleteByPluginName.name,
    () => {
      it('deletes only ranges for the given plugin', async () => {
        await insertPlugins(['plugin-a', 'plugin-b'])
        const a1 = range({ pluginName: 'plugin-a', chain: 'ethereum' })
        const a2 = range({ pluginName: 'plugin-a', chain: 'arbitrum' })
        const b1 = range({ pluginName: 'plugin-b', chain: 'ethereum' })
        await repository.upsert(a1)
        await repository.upsert(a2)
        await repository.upsert(b1)

        const deleted = await repository.deleteByPluginName('plugin-a')
        expect(deleted).toEqual(2)

        const all = await repository.getAll()
        expect(all).toEqual([b1])
      })
    },
  )

  describe(
    InteropPluginSyncedRangeRepository.prototype.deleteByPluginNameAndChain
      .name,
    () => {
      it('deletes only the specific range', async () => {
        await insertPlugins(['plugin-a'])
        const a1 = range({ pluginName: 'plugin-a', chain: 'ethereum' })
        const a2 = range({ pluginName: 'plugin-a', chain: 'arbitrum' })
        await repository.upsert(a1)
        await repository.upsert(a2)

        const deleted = await repository.deleteByPluginNameAndChain(
          'plugin-a',
          'ethereum',
        )
        expect(deleted).toEqual(1)

        const all = await repository.getAll()
        expect(all).toEqual([a2])
      })
    },
  )

  describe(InteropPluginSyncedRangeRepository.prototype.getAll.name, () => {
    it('returns all records', async () => {
      await insertPlugins(['plugin-a', 'plugin-b'])
      const a1 = range({ pluginName: 'plugin-a', chain: 'ethereum' })
      const a2 = range({ pluginName: 'plugin-a', chain: 'arbitrum' })
      const b1 = range({ pluginName: 'plugin-b', chain: 'ethereum' })

      await repository.upsert(a1)
      await repository.upsert(a2)
      await repository.upsert(b1)

      const all = await repository.getAll()
      expect(all).toEqualUnsorted([a1, a2, b1])
    })
  })

  describe(
    InteropPluginSyncedRangeRepository.prototype.findByPluginNameAndChain.name,
    () => {
      it('returns the matching range', async () => {
        await insertPlugins(['plugin-a', 'plugin-b'])
        const a1 = range({ pluginName: 'plugin-a', chain: 'ethereum' })
        const a2 = range({ pluginName: 'plugin-a', chain: 'arbitrum' })
        const b1 = range({ pluginName: 'plugin-b', chain: 'ethereum' })
        await repository.upsert(a1)
        await repository.upsert(a2)
        await repository.upsert(b1)

        const found = await repository.findByPluginNameAndChain(
          'plugin-a',
          'arbitrum',
        )
        expect(found).toEqual(a2)
      })

      it('returns undefined when no matching range exists', async () => {
        await insertPlugins(['plugin-a'])
        await repository.upsert(
          range({ pluginName: 'plugin-a', chain: 'ethereum' }),
        )

        const found = await repository.findByPluginNameAndChain(
          'plugin-a',
          'arbitrum',
        )
        expect(found).toEqual(undefined)
      })
    },
  )

  describe(
    InteropPluginSyncedRangeRepository.prototype.updateByPluginNameAndChain
      .name,
    () => {
      it('updates record and returns number of affected rows', async () => {
        await insertPlugins(['plugin-a'])
        const record = range({
          pluginName: 'plugin-a',
          chain: 'ethereum',
          fromBlock: 1n,
          fromTimestamp: UnixTime(100),
          toBlock: 2n,
          toTimestamp: UnixTime(200),
        })
        await repository.upsert(record)

        const updated = await repository.updateByPluginNameAndChain(
          'plugin-a',
          'ethereum',
          {
            fromBlock: 10n,
            fromTimestamp: UnixTime(1000),
            toBlock: 20n,
            toTimestamp: UnixTime(2000),
          },
        )

        expect(updated).toEqual(1)

        const stored = await repository.findByPluginNameAndChain(
          'plugin-a',
          'ethereum',
        )
        expect(stored).toEqual({
          ...record,
          fromBlock: 10n,
          fromTimestamp: UnixTime(1000),
          toBlock: 20n,
          toTimestamp: UnixTime(2000),
        })
      })

      it('returns 0 when no matching range exists', async () => {
        await insertPlugins(['plugin-a'])

        const updated = await repository.updateByPluginNameAndChain(
          'plugin-a',
          'ethereum',
          {
            fromBlock: 10n,
          },
        )

        expect(updated).toEqual(0)
      })
    },
  )

  describe(InteropPluginSyncedRangeRepository.prototype.deleteAll.name, () => {
    it('deletes all records', async () => {
      await insertPlugins(['plugin-a', 'plugin-b'])
      await repository.upsert(range({ pluginName: 'plugin-a', chain: 'op' }))
      await repository.upsert(
        range({ pluginName: 'plugin-b', chain: 'arbitrum' }),
      )

      const deleted = await repository.deleteAll()
      expect(deleted).toEqual(2)

      const all = await repository.getAll()
      expect(all).toEqual([])
    })
  })

  async function insertPlugins(pluginNames: string[]) {
    for (const pluginName of new Set(pluginNames)) {
      await statusRepository.insert({
        pluginName,
        lastError: null,
        resyncRequestedFrom: null,
      })
    }
  }
})

function range(
  overrides: Partial<InteropPluginSyncedRangeRecord> & {
    pluginName: string
    chain: string
  },
): InteropPluginSyncedRangeRecord {
  return {
    pluginName: overrides.pluginName,
    chain: overrides.chain,
    fromBlock: overrides.fromBlock ?? 1n,
    fromTimestamp: overrides.fromTimestamp ?? UnixTime(100),
    toBlock: overrides.toBlock ?? 2n,
    toTimestamp: overrides.toTimestamp ?? UnixTime(200),
  }
}
