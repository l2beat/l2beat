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
          }),
        )
      })

      it('updates resyncRequestedFrom without touching other fields', async () => {
        const initialResyncRequestedFrom = UnixTime.fromDate(
          new Date('2023-01-01'),
        )
        const initialResyncRequestedAt = UnixTime.fromDate(
          new Date('2023-01-03'),
        )
        const record = state({
          pluginName: 'plugin-a',
          chain: 'ethereum',
          lastError: 'Initial error',
          resyncRequestedFrom: initialResyncRequestedFrom,
          resyncRequestedAt: initialResyncRequestedAt,
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
        })
      })
    },
  )

  describe(
    InteropPluginSyncStateRepository.prototype.setResyncRequest.name,
    () => {
      it('sets resync request without touching lastError', async () => {
        const record = state({
          pluginName: 'plugin-a',
          chain: 'ethereum',
          lastError: 'Initial error',
        })
        await repository.upsert(record)

        const resyncRequestedFrom = UnixTime.fromDate(new Date('2023-01-01'))
        const resyncRequestedAt = UnixTime.fromDate(new Date('2023-01-02'))
        await repository.setResyncRequest(
          'plugin-a',
          'ethereum',
          resyncRequestedFrom,
          resyncRequestedAt,
        )

        const stored = await repository.findByPluginNameAndChain(
          record.pluginName,
          record.chain,
        )
        expect(stored).toEqual({
          ...record,
          resyncRequestedFrom,
          resyncRequestedAt,
        })
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
    resyncRequestedAt: overrides.resyncRequestedAt ?? null,
  }
}
