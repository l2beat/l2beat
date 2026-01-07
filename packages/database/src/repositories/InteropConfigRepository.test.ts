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
    it('returns all configs matching empty prefix', async () => {
      const record1 = mockConfig('app.setting1', { value: 1 })
      const record2 = mockConfig('db.connection', { host: 'localhost' })
      const record3 = mockConfig('cache.ttl', 300)

      await repository.insert(record1)
      await repository.insert(record2)
      await repository.insert(record3)

      const result = await repository.getAllLatest()

      expect(result).toHaveLength(3)
      expect(result).toEqualUnsorted([record1, record2, record3])
    })

    it('returns latest record for each key when multiple versions exist', async () => {
      const olderRecord = mockConfig('setting', { version: 1 })
      olderRecord.timestamp = UnixTime.fromDate(new Date('2023-01-01'))

      const newerRecord = mockConfig('setting', { version: 2 })
      newerRecord.timestamp = UnixTime.fromDate(new Date('2023-01-02'))

      const otherRecord = mockConfig('other', { value: 'test' })

      // Insert in chronological order
      await repository.insert(olderRecord)
      await repository.insert(newerRecord)
      await repository.insert(otherRecord)

      const result = await repository.getAllLatest()

      expect(result).toHaveLength(2)
      expect(result).toEqualUnsorted([newerRecord, otherRecord])
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
