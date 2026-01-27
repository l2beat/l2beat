import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type InteropPluginSyncStateRecord,
  InteropPluginSyncStateRepository,
} from './InteropPluginSyncStateRepository'

describeDatabase(InteropPluginSyncStateRepository.name, (db) => {
  const repository = db.interopPluginSyncState

  afterEach(async () => {
    await repository.deleteAll()
  })

  describe(InteropPluginSyncStateRepository.prototype.upsert.name, () => {
    it('inserts new record', async () => {
      const resyncRequestedFrom = UnixTime.fromDate(new Date('2023-01-01'))
      const record = state({
        pluginName: 'plugin-a',
        chain: 'ethereum',
        lastError: 'Some RPC error',
        resyncRequestedFrom,
        wipeRequired: true,
      })

      await repository.upsert(record)

      const stored = await repository.findByPluginNameAndChain(
        record.pluginName,
        record.chain,
      )
      expect(stored).toEqual(record)
    })

    it('updates record for the same plugin and chain', async () => {
      const firstResyncRequestedFrom = UnixTime.fromDate(new Date('2023-01-01'))
      const record = state({
        pluginName: 'plugin-a',
        chain: 'ethereum',
        lastError: 'Some RPC error',
        resyncRequestedFrom: firstResyncRequestedFrom,
        wipeRequired: true,
      })
      await repository.upsert(record)

      const secondResyncRequestedFrom = UnixTime.fromDate(
        new Date('2023-01-02'),
      )
      const updated = state({
        pluginName: 'plugin-a',
        chain: 'ethereum',
        lastError: 'fixed',
        resyncRequestedFrom: secondResyncRequestedFrom,
        wipeRequired: true,
      })
      await repository.upsert(updated)

      const all = await repository.getAll()
      expect(all).toEqual([updated])
    })
  })

  describe(InteropPluginSyncStateRepository.prototype.setLastError.name, () => {
    it('inserts a new record when missing', async () => {
      await repository.setLastError('plugin-a', 'ethereum', 'Some error')

      const stored = await repository.findByPluginNameAndChain(
        'plugin-a',
        'ethereum',
      )
      expect(stored).toEqual(
        state({
          pluginName: 'plugin-a',
          chain: 'ethereum',
          lastError: 'Some error',
        }),
      )
    })

    it('updates lastError without touching other fields', async () => {
      const resyncRequestedFrom = UnixTime.fromDate(new Date('2023-01-01'))
      const record = state({
        pluginName: 'plugin-a',
        chain: 'ethereum',
        lastError: 'Initial error',
        resyncRequestedFrom,
        wipeRequired: true,
      })
      await repository.upsert(record)

      await repository.setLastError('plugin-a', 'ethereum', 'Updated error')

      const stored = await repository.findByPluginNameAndChain(
        record.pluginName,
        record.chain,
      )
      expect(stored).toEqual({
        ...record,
        lastError: 'Updated error',
      })
    })
  })

  describe(
    InteropPluginSyncStateRepository.prototype.setResyncRequestedFrom.name,
    () => {
      it('inserts a new record when missing', async () => {
        const resyncRequestedFrom = UnixTime.fromDate(new Date('2023-01-01'))
        await repository.setResyncRequestedFrom(
          'plugin-a',
          'ethereum',
          resyncRequestedFrom,
        )

        const stored = await repository.findByPluginNameAndChain(
          'plugin-a',
          'ethereum',
        )
        expect(stored).toEqual(
          state({
            pluginName: 'plugin-a',
            chain: 'ethereum',
            resyncRequestedFrom,
            wipeRequired: true,
          }),
        )
      })

      it('updates resyncRequestedFrom and marks wipeRequired', async () => {
        const initialResyncRequestedFrom = UnixTime.fromDate(
          new Date('2023-01-01'),
        )
        const record = state({
          pluginName: 'plugin-a',
          chain: 'ethereum',
          lastError: 'Initial error',
          resyncRequestedFrom: initialResyncRequestedFrom,
        })
        await repository.upsert(record)

        const updatedResyncRequestedFrom = UnixTime.fromDate(
          new Date('2023-01-02'),
        )
        await repository.setResyncRequestedFrom(
          'plugin-a',
          'ethereum',
          updatedResyncRequestedFrom,
        )

        const stored = await repository.findByPluginNameAndChain(
          record.pluginName,
          record.chain,
        )
        expect(stored).toEqual({
          ...record,
          resyncRequestedFrom: updatedResyncRequestedFrom,
          wipeRequired: true,
        })
      })
    },
  )

  describe(
    InteropPluginSyncStateRepository.prototype.clearResyncRequestUnlessWipePending
      .name,
    () => {
      it('clears resyncRequestedFrom only when wipeRequired is false', async () => {
        const record = state({
          pluginName: 'plugin-a',
          chain: 'ethereum',
          lastError: 'Initial error',
          resyncRequestedFrom: UnixTime.fromDate(new Date('2023-01-01')),
          wipeRequired: true,
        })
        await repository.upsert(record)
        await repository.updateByPluginNameAndChain(
          record.pluginName,
          record.chain,
          {
            wipeRequired: false,
          },
        )

        const updated = await repository.clearResyncRequestUnlessWipePending(
          record.pluginName,
          record.chain,
        )

        expect(updated).toEqual(1)

        const stored = await repository.findByPluginNameAndChain(
          record.pluginName,
          record.chain,
        )
        expect(stored).toEqual({
          ...record,
          resyncRequestedFrom: null,
          wipeRequired: false,
        })
      })

      it('does not clear resyncRequestedFrom when wipeRequired is true', async () => {
        const resyncRequestedFrom = UnixTime.fromDate(new Date('2023-01-01'))
        const record = state({
          pluginName: 'plugin-a',
          chain: 'ethereum',
          resyncRequestedFrom,
          wipeRequired: true,
        })

        await repository.upsert(record)

        const updated = await repository.clearResyncRequestUnlessWipePending(
          record.pluginName,
          record.chain,
        )

        expect(updated).toEqual(0)

        const stored = await repository.findByPluginNameAndChain(
          record.pluginName,
          record.chain,
        )
        expect(stored).toEqual(record)
      })

      it('returns 0 when no matching record exists', async () => {
        const updated = await repository.clearResyncRequestUnlessWipePending(
          'plugin-a',
          'ethereum',
        )
        expect(updated).toEqual(0)
      })
    },
  )

  describe(
    InteropPluginSyncStateRepository.prototype.updateByPluginNameAndChain.name,
    () => {
      it('updates record and returns number of affected rows', async () => {
        const firstResyncRequestedFrom = UnixTime.fromDate(
          new Date('2023-01-01'),
        )
        const record = state({
          pluginName: 'plugin-a',
          chain: 'ethereum',
          lastError: 'Some RPC error',
          resyncRequestedFrom: firstResyncRequestedFrom,
          wipeRequired: true,
        })
        await repository.upsert(record)

        const secondResyncRequestedFrom = UnixTime.fromDate(
          new Date('2023-01-02'),
        )
        const updated = await repository.updateByPluginNameAndChain(
          record.pluginName,
          record.chain,
          {
            lastError: null,
            resyncRequestedFrom: secondResyncRequestedFrom,
            wipeRequired: false,
          },
        )

        expect(updated).toEqual(1)

        const stored = await repository.findByPluginNameAndChain(
          record.pluginName,
          record.chain,
        )
        expect(stored).toEqual({
          ...record,
          lastError: null,
          resyncRequestedFrom: secondResyncRequestedFrom,
          wipeRequired: false,
        })
      })

      it('returns 0 when no matching record exists', async () => {
        const updated = await repository.updateByPluginNameAndChain(
          'plugin-a',
          'ethereum',
          {
            lastError: 'Some error',
          },
        )

        expect(updated).toEqual(0)
      })
    },
  )

  describe(
    InteropPluginSyncStateRepository.prototype.updateByPluginName.name,
    () => {
      it('updates records for the plugin name', async () => {
        const a1 = state({ pluginName: 'plugin-a', chain: 'ethereum' })
        const a2 = state({ pluginName: 'plugin-a', chain: 'arbitrum' })
        const b1 = state({ pluginName: 'plugin-b', chain: 'ethereum' })
        await repository.upsert(a1)
        await repository.upsert(a2)
        await repository.upsert(b1)

        const updated = await repository.updateByPluginName('plugin-a', {
          wipeRequired: true,
        })

        expect(updated).toEqual(2)

        const pluginA = await repository.findByPluginName('plugin-a')
        expect(pluginA).toEqualUnsorted([
          { ...a1, wipeRequired: true },
          { ...a2, wipeRequired: true },
        ])
        const pluginB = await repository.findByPluginName('plugin-b')
        expect(pluginB).toEqual([b1])
      })
    },
  )

  describe(
    InteropPluginSyncStateRepository.prototype.findByPluginNameAndChain.name,
    () => {
      it('returns the matching record', async () => {
        const a1 = state({ pluginName: 'plugin-a', chain: 'ethereum' })
        const a2 = state({ pluginName: 'plugin-a', chain: 'arbitrum' })
        const b1 = state({ pluginName: 'plugin-b', chain: 'ethereum' })
        await repository.upsert(a1)
        await repository.upsert(a2)
        await repository.upsert(b1)

        const found = await repository.findByPluginNameAndChain(
          'plugin-a',
          'arbitrum',
        )
        expect(found).toEqual(a2)
      })

      it('returns undefined when no matching record exists', async () => {
        await repository.upsert(
          state({ pluginName: 'plugin-a', chain: 'ethereum' }),
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
    InteropPluginSyncStateRepository.prototype.findByPluginName.name,
    () => {
      it('returns matching records', async () => {
        const a1 = state({ pluginName: 'plugin-a', chain: 'ethereum' })
        const a2 = state({ pluginName: 'plugin-a', chain: 'arbitrum' })
        const b1 = state({ pluginName: 'plugin-b', chain: 'ethereum' })
        await repository.upsert(a1)
        await repository.upsert(a2)
        await repository.upsert(b1)

        const found = await repository.findByPluginName('plugin-a')
        expect(found).toEqualUnsorted([a1, a2])
      })

      it('returns empty array when no matching records exist', async () => {
        await repository.upsert(
          state({ pluginName: 'plugin-a', chain: 'ethereum' }),
        )

        const found = await repository.findByPluginName('plugin-b')
        expect(found).toEqual([])
      })
    },
  )

  describe(InteropPluginSyncStateRepository.prototype.getAll.name, () => {
    it('returns all records', async () => {
      const a1 = state({ pluginName: 'plugin-a', chain: 'ethereum' })
      const a2 = state({ pluginName: 'plugin-a', chain: 'arbitrum' })
      const b1 = state({ pluginName: 'plugin-b', chain: 'ethereum' })

      await repository.upsert(a1)
      await repository.upsert(a2)
      await repository.upsert(b1)

      const all = await repository.getAll()
      expect(all).toEqualUnsorted([a1, a2, b1])
    })
  })

  describe(InteropPluginSyncStateRepository.prototype.deleteAll.name, () => {
    it('deletes all records', async () => {
      await repository.upsert(state({ pluginName: 'plugin-a', chain: 'op' }))
      await repository.upsert(
        state({ pluginName: 'plugin-b', chain: 'arbitrum' }),
      )

      const deleted = await repository.deleteAll()
      expect(deleted).toEqual(2)

      const all = await repository.getAll()
      expect(all).toEqual([])
    })
  })
})

function state(
  overrides: Partial<InteropPluginSyncStateRecord> & {
    pluginName: string
    chain: string
  },
): InteropPluginSyncStateRecord {
  return {
    pluginName: overrides.pluginName,
    chain: overrides.chain,
    lastError: overrides.lastError ?? null,
    resyncRequestedFrom: overrides.resyncRequestedFrom ?? null,
    wipeRequired: overrides.wipeRequired ?? false,
  }
}
