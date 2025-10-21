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

  describe(InteropConfigRepository.prototype.getAllNetworks.name, () => {
    it('returns empty array when no network records exist', async () => {
      // Insert non-network records
      const nonNetworkRecord = mockConfig('config::setting', { value: 'test' })
      await repository.insert(nonNetworkRecord)

      const result = await repository.getAllNetworks()

      expect(result).toEqual([])
    })

    it('returns only network records when they exist', async () => {
      const networkRecord = mockConfig('network::ethereum', { chainId: 1 })
      const nonNetworkRecord = mockConfig('config::setting', { value: 'test' })

      await repository.insert(networkRecord)
      await repository.insert(nonNetworkRecord)

      const result = await repository.getAllNetworks()

      expect(result).toEqual([networkRecord])
    })

    it('returns latest network record for each key', async () => {
      // Insert multiple records for network::ethereum
      const ethereumOld = mockConfig('network::ethereum', { version: 1 })
      ethereumOld.timestamp = UnixTime.fromDate(new Date('2023-01-01'))

      const ethereumLatest = mockConfig('network::ethereum', { version: 2 })
      ethereumLatest.timestamp = UnixTime.fromDate(new Date('2023-01-03'))

      // Insert multiple records for network::polygon
      const polygonOld = mockConfig('network::polygon', { version: 1 })
      polygonOld.timestamp = UnixTime.fromDate(new Date('2023-01-02'))

      const polygonLatest = mockConfig('network::polygon', { version: 2 })
      polygonLatest.timestamp = UnixTime.fromDate(new Date('2023-01-04'))

      // Insert single record for network::arbitrum
      const arbitrumOnly = mockConfig('network::arbitrum', { version: 1 })
      arbitrumOnly.timestamp = UnixTime.fromDate(new Date('2023-01-01'))

      // Insert non-network records (should be ignored)
      const configRecord = mockConfig('config::setting', { value: 'test' })
      const otherRecord = mockConfig('other::key', { value: 'test' })

      await repository.insert(configRecord)
      await repository.insert(otherRecord)

      // Insert network records in mixed order
      await repository.insert(ethereumOld)
      await repository.insert(polygonLatest)
      await repository.insert(arbitrumOnly)
      await repository.insert(polygonOld)
      await repository.insert(ethereumLatest)

      const result = await repository.getAllNetworks()

      // Should return only the latest network records
      expect(result).toHaveLength(3)

      // Sort by key for consistent testing
      const sortedResult = result.sort((a, b) => a.key.localeCompare(b.key))
      expect(sortedResult[0]).toEqual(arbitrumOnly) // network::arbitrum
      expect(sortedResult[1]).toEqual(ethereumLatest) // network::ethereum
      expect(sortedResult[2]).toEqual(polygonLatest) // network::polygon
    })

    it('handles network records with same timestamp', async () => {
      const timestamp = UnixTime.now()
      const network1 = mockConfig('network::ethereum', { value: 'first' })
      network1.timestamp = timestamp

      const network2 = mockConfig('network::polygon', { value: 'second' })
      network2.timestamp = timestamp

      // Insert non-network record with same timestamp (should be ignored)
      const nonNetwork = mockConfig('config::setting', { value: 'ignored' })
      nonNetwork.timestamp = timestamp

      await repository.insert(network1)
      await repository.insert(network2)
      await repository.insert(nonNetwork)

      const result = await repository.getAllNetworks()

      expect(result).toHaveLength(2)
      expect(result.map((r) => r.key).sort()).toEqual([
        'network::ethereum',
        'network::polygon',
      ])
    })

    it('filters out keys that contain network:: but do not start with it', async () => {
      const validNetwork = mockConfig('network::ethereum', { chainId: 1 })
      const invalidKey1 = mockConfig('config::network::ethereum', {
        chainId: 1,
      })
      const invalidKey2 = mockConfig('test-network::polygon', { chainId: 137 })

      await repository.insert(validNetwork)
      await repository.insert(invalidKey1)
      await repository.insert(invalidKey2)

      const result = await repository.getAllNetworks()

      expect(result).toEqual([validNetwork])
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
