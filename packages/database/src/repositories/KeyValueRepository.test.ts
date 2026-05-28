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
      const result = await repository.get(
        'interop-aggregate-timestamp-override',
      )

      expect(result).toEqual(undefined)
    })
  })

  describe(KeyValueRepository.prototype.set.name, () => {
    it('inserts a value', async () => {
      await repository.set({
        key: 'interop-aggregate-timestamp-override',
        value: 1234,
        updatedBy: 'test',
      })

      const result = await repository.get(
        'interop-aggregate-timestamp-override',
      )

      expect(result).toEqual({
        key: 'interop-aggregate-timestamp-override',
        value: 1234,
        updatedAt: expect.a(Number),
        updatedBy: 'test',
      })
    })

    it('updates an existing value', async () => {
      await repository.set({
        key: 'interop-aggregate-timestamp-override',
        value: 1234,
        updatedBy: 'test',
      })
      await repository.set({
        key: 'interop-aggregate-timestamp-override',
        value: 5678,
        updatedBy: 'test-2',
      })

      const result = await repository.get(
        'interop-aggregate-timestamp-override',
      )

      expect(result).toEqual({
        key: 'interop-aggregate-timestamp-override',
        value: 5678,
        updatedAt: expect.a(Number),
        updatedBy: 'test-2',
      })
    })
  })
})
