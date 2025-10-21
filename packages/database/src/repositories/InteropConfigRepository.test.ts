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

    it('returns latest record when multiple records exist for the same key', async () => {
      const earlierRecord = mockConfig('test-key', { version: 1 })
      earlierRecord.timestamp = UnixTime.fromDate(new Date('2023-01-01'))

      const laterRecord = mockConfig('test-key', { version: 2 })
      laterRecord.timestamp = UnixTime.fromDate(new Date('2023-01-02'))

      // Insert in reverse chronological order to test ordering
      await repository.insert(laterRecord)
      await repository.insert(earlierRecord)

      const result = await repository.find('test-key')

      expect(result).toEqual(laterRecord)
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

  describe(InteropConfigRepository.prototype.getAllLatest.name, () => {
    it('returns empty array when no records exist', async () => {
      const result = await repository.getAllLatest()

      expect(result).toEqual([])
    })

    it('returns single record when only one record exists', async () => {
      const record = mockConfig('single-key', { value: 'test' })
      await repository.insert(record)

      const result = await repository.getAllLatest()

      expect(result).toEqual([record])
    })

    it('returns latest record for each key', async () => {
      // Insert multiple records for key1
      const key1Old = mockConfig('key1', { version: 1 })
      key1Old.timestamp = UnixTime.fromDate(new Date('2023-01-01'))

      const key1Latest = mockConfig('key1', { version: 2 })
      key1Latest.timestamp = UnixTime.fromDate(new Date('2023-01-03'))

      // Insert multiple records for key2
      const key2Old = mockConfig('key2', { version: 1 })
      key2Old.timestamp = UnixTime.fromDate(new Date('2023-01-02'))

      const key2Latest = mockConfig('key2', { version: 2 })
      key2Latest.timestamp = UnixTime.fromDate(new Date('2023-01-04'))

      // Insert single record for key3
      const key3Only = mockConfig('key3', { version: 1 })
      key3Only.timestamp = UnixTime.fromDate(new Date('2023-01-01'))

      // Insert in mixed order
      await repository.insert(key1Old)
      await repository.insert(key2Latest)
      await repository.insert(key3Only)
      await repository.insert(key2Old)
      await repository.insert(key1Latest)

      const result = await repository.getAllLatest()

      // Should return only the latest records
      expect(result).toHaveLength(3)

      // Sort by key for consistent testing
      const sortedResult = result.sort((a, b) => a.key.localeCompare(b.key))
      expect(sortedResult[0]).toEqual(key1Latest) // key1
      expect(sortedResult[1]).toEqual(key2Latest) // key2
      expect(sortedResult[2]).toEqual(key3Only) // key3
    })

    it('handles records with same timestamp', async () => {
      const timestamp = UnixTime.now()
      const record1 = mockConfig('same-time-1', { value: 'first' })
      record1.timestamp = timestamp

      const record2 = mockConfig('same-time-2', { value: 'second' })
      record2.timestamp = timestamp

      await repository.insert(record1)
      await repository.insert(record2)

      const result = await repository.getAllLatest()

      expect(result).toHaveLength(2)
      expect(result.map((r) => r.key).sort()).toEqual([
        'same-time-1',
        'same-time-2',
      ])
    })
  })

  afterEach(async () => {
    await repository.deleteAll()
  })
})

function mockConfig(key: string, value: unknown): InteropConfigRecord {
  return {
    key,
    value,
    timestamp: UnixTime.now(),
  }
}
