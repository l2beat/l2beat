import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type InteropPluginStatusRecord,
  InteropPluginStatusRepository,
} from './InteropPluginStatusRepository'

describeDatabase(InteropPluginStatusRepository.name, (db) => {
  const repository = db.interopPluginStatus

  afterEach(async () => {
    await repository.deleteAll()
  })

  describe(InteropPluginStatusRepository.prototype.insert.name, () => {
    it('inserts record with optional fields', async () => {
      const record = status({
        pluginName: 'plugin-a',
        lastError: 'Some RPC error',
        resyncRequestedFrom: UnixTime(123),
      })

      const inserted = await repository.insert(record)
      expect(inserted).toEqual(record)

      const stored = await repository.findByPluginName(record.pluginName)
      expect(stored).toEqual(record)
    })

    it('accepts null optional fields', async () => {
      const record = status({
        pluginName: 'plugin-a',
        lastError: null,
        resyncRequestedFrom: null,
      })

      const inserted = await repository.insert(record)
      expect(inserted).toEqual(record)

      const stored = await repository.findByPluginName(record.pluginName)
      expect(stored).toEqual(record)
    })

    it('throws error when inserting duplicate pluginName', async () => {
      const record = status({ pluginName: 'plugin-a' })

      const inserted = await repository.insert(record)
      expect(inserted).toEqual(record)

      await expect(repository.insert(record)).toBeRejected()
    })
  })

  describe(
    InteropPluginStatusRepository.prototype.updateByPluginName.name,
    () => {
      it('updates record and returns number of affected rows', async () => {
        const record = status({
          pluginName: 'plugin-a',
          lastError: 'Some RPC error',
          resyncRequestedFrom: UnixTime(100),
        })
        await repository.insert(record)

        const updated = await repository.updateByPluginName(record.pluginName, {
          lastError: null,
          resyncRequestedFrom: null,
        })

        expect(updated).toEqual(1)

        const stored = await repository.findByPluginName(record.pluginName)
        expect(stored).toEqual({
          ...record,
          lastError: null,
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

  describe(InteropPluginStatusRepository.prototype.getAll.name, () => {
    it('returns all records', async () => {
      const a = status({ pluginName: 'plugin-a' })
      const b = status({
        pluginName: 'plugin-b',
      })

      await repository.insert(a)
      await repository.insert(b)

      const all = await repository.getAll()
      expect(all).toEqualUnsorted([a, b])
    })
  })
})

function status(
  overrides: Partial<InteropPluginStatusRecord> & { pluginName: string },
): InteropPluginStatusRecord {
  return {
    pluginName: overrides.pluginName,
    lastError: overrides.lastError ?? null,
    resyncRequestedFrom: overrides.resyncRequestedFrom ?? null,
  }
}
