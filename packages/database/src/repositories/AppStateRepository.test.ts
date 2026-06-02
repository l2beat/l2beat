import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import { AppStateRepository } from './AppStateRepository'

describeDatabase(AppStateRepository.name, (db) => {
  const repository = db.appState

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(AppStateRepository.prototype.get.name, () => {
    it('returns undefined when value is missing', async () => {
      const result = await repository.get('interopAggregatesTimestampOverride')

      expect(result).toEqual(undefined)
    })
  })

  describe(AppStateRepository.prototype.set.name, () => {
    it('inserts a value', async () => {
      await repository.set({
        key: 'interopAggregatesTimestampOverride',
        value: 1234,
        updatedBy: 'test',
      })

      const result = await repository.get('interopAggregatesTimestampOverride')

      expect(result).toEqual({
        key: 'interopAggregatesTimestampOverride',
        value: 1234,
        updatedAt: expect.a(Number),
        updatedBy: 'test',
      })
    })

    it('updates an existing value', async () => {
      await repository.set({
        key: 'interopAggregatesTimestampOverride',
        value: 1234,
        updatedBy: 'test',
      })
      await repository.set({
        key: 'interopAggregatesTimestampOverride',
        value: 5678,
        updatedBy: 'test-2',
      })

      const result = await repository.get('interopAggregatesTimestampOverride')

      expect(result).toEqual({
        key: 'interopAggregatesTimestampOverride',
        value: 5678,
        updatedAt: expect.a(Number),
        updatedBy: 'test-2',
      })
    })
  })

  describe(AppStateRepository.prototype.deleteAll.name, () => {
    it('unsets a previously set value', async () => {
      await repository.set({
        key: 'interopAggregatesTimestampOverride',
        value: 1234,
        updatedBy: 'test',
      })

      await repository.deleteAll()

      const result = await repository.get('interopAggregatesTimestampOverride')

      expect(result).toEqual(undefined)
    })
  })
})
