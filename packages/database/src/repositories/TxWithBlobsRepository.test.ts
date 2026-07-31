import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type TxWithBlobsRecord,
  TxWithBlobsRepository,
} from './TxWithBlobsRepository'

describeDatabase(TxWithBlobsRepository.name, (db) => {
  const repository = db.txWithBlobs

  const START = UnixTime.now()
  const DATA: TxWithBlobsRecord[] = [
    {
      id: 1,
      blockNumber: 1000,
      timestamp: START - 1 * UnixTime.HOUR,
      daLayer: 'ethereum',
      from: '0x123',
      to: '0x456',
      txHash: '0xtx1',
      blobCount: 2,
      logs: [{ emitter: '0x789', topics: ['0xabc', '0xdef'] }],
      topics: null,
    },
    {
      // Legacy shape: backfilled from the per-blob table.
      id: 2,
      blockNumber: 2000,
      timestamp: START - 2 * UnixTime.HOUR,
      daLayer: 'avail',
      from: '0x789',
      to: null,
      txHash: null,
      blobCount: 1,
      logs: null,
      topics: null,
    },
    {
      id: 3,
      blockNumber: 3000,
      timestamp: START - 3 * UnixTime.HOUR,
      daLayer: 'avail',
      from: '0xabc',
      to: '0xdef',
      txHash: null,
      blobCount: 3,
      logs: null,
      topics: ['0x123'],
    },
  ]

  beforeEach(async function () {
    this.timeout(10000)
    await repository.deleteAll()
    await repository.insertMany(DATA)
  })

  describe(TxWithBlobsRepository.prototype.insertMany.name, () => {
    it('add new', async () => {
      const newRows: TxWithBlobsRecord[] = [
        {
          id: 4,
          blockNumber: 4000,
          timestamp: START - 4 * UnixTime.HOUR,
          daLayer: 'eigen-da',
          from: '0x111',
          to: '0x222',
          txHash: '0xtx4',
          blobCount: 1,
          logs: [{ emitter: '0x444', topics: ['0x333'] }],
          topics: null,
        },
        {
          id: 5,
          blockNumber: 5000,
          timestamp: START - 5 * UnixTime.HOUR,
          daLayer: 'ethereum',
          from: '0x444',
          to: null,
          txHash: null,
          blobCount: 1,
          logs: null,
          topics: null,
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

  describe(TxWithBlobsRepository.prototype.getAll.name, () => {
    it('should return all rows', async () => {
      const results = await repository.getAll()

      expect(results).toEqualUnsorted(
        DATA.map((e) => ({
          ...e,
        })),
      )
    })
  })

  describe(
    TxWithBlobsRepository.prototype.getByBlockRangeInclusive.name,
    () => {
      it('should return all rows for related entity', async () => {
        const results = await repository.getByBlockRangeInclusive(
          'avail',
          2000,
          3000,
        )

        expect(results).toEqualUnsorted(DATA.slice(1, 3))
      })

      it('should return rows in ascending block order', async () => {
        await repository.deleteAll()
        await repository.insertMany([
          txWithBlobs({ blockNumber: 30 }),
          txWithBlobs({ blockNumber: 10 }),
          txWithBlobs({ blockNumber: 20 }),
        ])

        const results = await repository.getByBlockRangeInclusive(
          'ethereum',
          0,
          100,
        )

        expect(results.map((r) => r.blockNumber)).toEqual([10, 20, 30])
      })
    },
  )

  describe(TxWithBlobsRepository.prototype.getCountPerAddressInbox.name, () => {
    it('should group by from and to and sum blob counts', async () => {
      await repository.deleteAll()
      const base = UnixTime.toStartOf(UnixTime.now(), 'day')
      await repository.insertMany([
        txWithBlobs({
          from: '0xA',
          to: '0xB',
          blobCount: 3,
          timestamp: base + 1,
          blockNumber: 10,
        }),
        txWithBlobs({
          from: '0xA',
          to: '0xB',
          blobCount: 2,
          timestamp: base + 2,
          blockNumber: 11,
        }),
        txWithBlobs({
          from: '0xA',
          to: '0xC',
          blobCount: 1,
          timestamp: base + 3,
          blockNumber: 12,
        }),
      ])

      const results = await repository.getCountPerAddressInbox(
        'ethereum',
        base,
        base + UnixTime.DAY,
      )

      expect(results).toEqualUnsorted([
        { from: '0xA', to: '0xB', count: 5 },
        { from: '0xA', to: '0xC', count: 1 },
      ])
    })

    it('should filter by timestamp range (inclusive start, exclusive end)', async () => {
      await repository.deleteAll()
      const base = UnixTime.toStartOf(UnixTime.now(), 'day')
      await repository.insertMany([
        txWithBlobs({ timestamp: base - 1, blockNumber: 10 }),
        txWithBlobs({ timestamp: base, blockNumber: 11 }),
        txWithBlobs({ timestamp: base + 100, blockNumber: 12 }),
        txWithBlobs({ timestamp: base + UnixTime.DAY, blockNumber: 13 }),
      ])

      const results = await repository.getCountPerAddressInbox(
        'ethereum',
        base,
        base + UnixTime.DAY,
      )

      expect(results).toEqual([{ from: '0x0', to: null, count: 2 }])
    })

    it('should return empty array when no data matches', async () => {
      await repository.deleteAll()
      const base = UnixTime.toStartOf(UnixTime.now(), 'day')

      const results = await repository.getCountPerAddressInbox(
        'ethereum',
        base,
        base + UnixTime.DAY,
      )

      expect(results).toEqual([])
    })
  })

  describe(TxWithBlobsRepository.prototype.deleteAll.name, () => {
    it('should delete all rows', async () => {
      await repository.deleteAll()

      const results = await repository.getAll()

      expect(results).toEqual([])
    })
  })

  describe(TxWithBlobsRepository.prototype.deleteAfter.name, () => {
    it('should delete all rows', async () => {
      await repository.deleteAfter('avail', 2000)

      const results = await repository.getAll()

      expect(results).toEqual(DATA.slice(0, 2))
    })
  })
})

function txWithBlobs(
  overrides: Partial<Omit<TxWithBlobsRecord, 'id'>>,
): Omit<TxWithBlobsRecord, 'id'> {
  return {
    blockNumber: overrides.blockNumber ?? 1,
    timestamp: overrides.timestamp ?? UnixTime.now(),
    daLayer: overrides.daLayer ?? 'ethereum',
    from: overrides.from ?? '0x0',
    to: overrides.to ?? null,
    txHash: overrides.txHash ?? null,
    blobCount: overrides.blobCount ?? 1,
    logs: overrides.logs ?? null,
    topics: overrides.topics ?? null,
  }
}
