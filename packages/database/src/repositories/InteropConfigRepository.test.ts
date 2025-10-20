import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type InteropConfigRecord,
  InteropConfigRepository,
} from './InteropConfigRepository'

describeDatabase(InteropConfigRepository.name, (database) => {
  const repository = database.interopConfig

  describe(InteropConfigRepository.prototype.find.name, () => {
    it('finds existing config by key', async () => {
      const record = mockConfig('test-key', { enabled: true })
      await repository.insert(record)

      const result = await repository.find('test-key')

      expect(result).toEqual(record)
    })

    it('returns undefined when config does not exist', async () => {
      const result = await repository.find('non-existent-key')

      expect(result).toEqual(undefined)
    })
  })

  describe(InteropConfigRepository.prototype.insert.name, () => {
    it('inserts new config record', async () => {
      const record = mockConfig('new-key', { setting: 'value' })

      await repository.insert(record)

      const result = await repository.find('new-key')
      expect(result).toEqual(record)
    })

    it('inserts config with array value', async () => {
      const arrayValue = ['item1', 'item2', { nested: 'object' }]
      const record = mockConfig('array-key', arrayValue)

      await repository.insert(record)

      const result = await repository.find('array-key')
      expect(result).toEqual(record)
    })

    it('throws error when inserting duplicate key', async () => {
      const record1 = mockConfig('duplicate-key', { value: 1 })
      const record2 = mockConfig('duplicate-key', { value: 2 })

      await repository.insert(record1)

      await expect(repository.insert(record2)).toBeRejected()
    })
  })

  describe(InteropConfigRepository.prototype.update.name, () => {
    it('updates existing config value', async () => {
      const originalRecord = mockConfig('update-key', { original: true })
      await repository.insert(originalRecord)

      const newValue = { updated: true, timestamp: Date.now() }
      const updatedAt = UnixTime.now()
      await repository.update('update-key', { value: newValue, updatedAt })

      const result = await repository.find('update-key')
      expect(result).toEqual({
        key: 'update-key',
        value: newValue,
        createdAt: originalRecord.createdAt,
        updatedAt: updatedAt,
      })
    })

    it('updates only updatedAt timestamp', async () => {
      const originalRecord = mockConfig('timestamp-key', { data: 'unchanged' })
      await repository.insert(originalRecord)

      const newUpdatedAt = UnixTime.now() + 3600
      await repository.update('timestamp-key', { updatedAt: newUpdatedAt })

      const result = await repository.find('timestamp-key')
      expect(result).toEqual({
        key: 'timestamp-key',
        value: { data: 'unchanged' },
        createdAt: originalRecord.createdAt,
        updatedAt: newUpdatedAt,
      })
    })

    it('updates only value without changing timestamps', async () => {
      const originalRecord = mockConfig('value-only-key', { old: 'value' })
      await repository.insert(originalRecord)

      const newValue = { new: 'value', more: 'data' }
      await repository.update('value-only-key', { value: newValue })

      const result = await repository.find('value-only-key')
      expect(result).toEqual({
        key: 'value-only-key',
        value: newValue,
        createdAt: originalRecord.createdAt,
        updatedAt: originalRecord.updatedAt,
      })
    })

    it('does not fail when updating non-existent key', async () => {
      await repository.update('non-existent', { value: { test: true } })

      const result = await repository.find('non-existent')
      expect(result).toEqual(undefined)
    })
  })

  afterEach(async () => {
    await repository.deleteAll()
  })
})

function mockConfig(key: string, value: unknown): InteropConfigRecord {
  const now = UnixTime.now()
  return {
    key,
    value,
    createdAt: now,
    updatedAt: now,
  }
}
