import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import { KeyValueRepository } from './KeyValueRepository'

describeDatabase(KeyValueRepository.name, (db) => {
  const repository = db.keyValue

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(KeyValueRepository.prototype.get.name, () => {
    it('returns undefined when value is missing', async () => {
      const result = await repository.get('missing-key')

      expect(result).toEqual(undefined)
    })
  })

  describe(KeyValueRepository.prototype.set.name, () => {
    it('inserts a value', async () => {
      await repository.set({
        key: 'feature-flag',
        value: 'enabled',
        updatedBy: 'test',
      })

      const result = await repository.get('feature-flag')

      expect(result).toEqual({
        key: 'feature-flag',
        value: 'enabled',
        updatedAt: expect.a(Number),
        updatedBy: 'test',
      })
    })

    it('updates an existing value', async () => {
      await repository.set({
        key: 'feature-flag',
        value: 'enabled',
        updatedBy: 'test',
      })
      await repository.set({
        key: 'feature-flag',
        value: 'disabled',
        updatedBy: 'test-2',
      })

      const result = await repository.get('feature-flag')

      expect(result).toEqual({
        key: 'feature-flag',
        value: 'disabled',
        updatedAt: expect.a(Number),
        updatedBy: 'test-2',
      })
    })
  })
})
