import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../../test/database'
import type { BlobRecord } from './entity'
import { BlobsRepository } from './repository'

describeDatabase(BlobsRepository.name, (db) => {
  const repository = db.blobs

  const START = UnixTime.now()
  const DATA: BlobRecord[] = [
    {
      id: 1,
      blockNumber: 1000,
      timestamp: START - 1 * UnixTime.HOUR,
      daLayer: 'ethereum',
      from: '0x123',
      to: '0x456',
      topics: ['0xabc', '0xdef'],
      size: BigInt(1000),
    },
    {
      id: 2,
      blockNumber: 2000,
      timestamp: START - 2 * UnixTime.HOUR,
      daLayer: 'avail',
      from: '0x789',
      to: null,
      topics: null,
      size: BigInt(2000),
    },
    {
      id: 3,
      blockNumber: 3000,
      timestamp: START - 3 * UnixTime.HOUR,
      daLayer: 'avail',
      from: '0xabc',
      to: '0xdef',
      topics: ['0x123'],
      size: BigInt(3000),
    },
  ]

  beforeEach(async function () {
    this.timeout(10000)
    await repository.deleteAll()
    await repository.insertMany(DATA)
  })

  describe(BlobsRepository.prototype.insertMany.name, () => {
    it('add new', async () => {
      const newRows: BlobRecord[] = [
        {
          id: 4,
          blockNumber: 4000,
          timestamp: START - 4 * UnixTime.HOUR,
          daLayer: 'eigen-da',
          from: '0x111',
          to: '0x222',
          topics: ['0x333'],
          size: BigInt(4000),
        },
        {
          id: 5,
          blockNumber: 5000,
          timestamp: START - 5 * UnixTime.HOUR,
          daLayer: 'ethereum',
          from: '0x444',
          to: null,
          topics: null,
          size: BigInt(5000),
        },
      ]

      await repository.insertMany(newRows)

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([...DATA, ...newRows])
    })

    it('empty array', async () => {
      await expect(repository.insertMany([])).not.toBeRejected()
    })
  })

  describe(BlobsRepository.prototype.getAll.name, () => {
    it('should return all rows', async () => {
      const results = await repository.getAll()

      expect(results).toEqualUnsorted(
        DATA.map((e) => ({
          ...e,
        })),
      )
    })
  })

  describe(BlobsRepository.prototype.getByBlockRangeInclusive.name, () => {
    it('should return all rows for related entity', async () => {
      const results = await repository.getByBlockRangeInclusive(
        'avail',
        2000,
        3000,
      )

      expect(results).toEqualUnsorted(DATA.slice(1, 3))
    })
  })

  describe(BlobsRepository.prototype.deleteAll.name, () => {
    it('should delete all rows', async () => {
      await repository.deleteAll()

      const results = await repository.getAll()

      expect(results).toEqual([])
    })
  })

  describe(BlobsRepository.prototype.deleteAfter.name, () => {
    it('should delete all rows', async () => {
      await repository.deleteAfter('avail', 2000)

      const results = await repository.getAll()

      expect(results).toEqual(DATA.slice(0, 2))
    })
  })
})
