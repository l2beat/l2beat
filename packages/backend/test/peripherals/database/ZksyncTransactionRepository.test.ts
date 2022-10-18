import { Logger } from '@l2beat/common'
import { UnixTime } from '@l2beat/types'
import { expect } from 'earljs'

import {
  ZksyncTransactionRecord,
  ZksyncTransactionRepository,
} from '../../../src/peripherals/database/ZksyncTransactionRepository'
import { setupDatabaseTestSuite } from './shared/setup'

describe(ZksyncTransactionRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const repository = new ZksyncTransactionRepository(database, Logger.SILENT)

  beforeEach(async () => {
    await repository.deleteAll()
    await repository.refreshFullySyncedDailyCounts()
  })

  describe(ZksyncTransactionRepository.prototype.getAll.name, () => {
    it('gets one record', async () => {
      const record = fakeRecord()
      await repository.addMany([record])

      expect(await repository.getAll()).toEqual([record])
    })

    it('gets multiple records', async () => {
      const records = [fakeRecord(), fakeRecord(), fakeRecord()]
      await repository.addMany(records)

      expect(await repository.getAll()).toBeAnArrayWith(...records)
    })
  })

  describe(ZksyncTransactionRepository.prototype.getMissingRanges.name, () => {
    it('works with an empty repository', async () => {
      expect(await repository.getMissingRanges()).toEqual([
        [-Infinity, Infinity],
      ])
    })

    it('finds holes', async () => {
      await repository.addMany([
        fakeRecord({ blockNumber: 0 }),
        fakeRecord({ blockNumber: 1 }),
        fakeRecord({ blockNumber: 6 }),
        fakeRecord({ blockNumber: 7 }),
        fakeRecord({ blockNumber: 10 }),
      ])

      expect(await repository.getMissingRanges()).toEqual([
        [-Infinity, 0],
        [2, 6],
        [8, 10],
        [11, Infinity],
      ])
    })

    it('finds holes when block 0 is missing', async () => {
      await repository.addMany([fakeRecord({ blockNumber: 1 })])

      expect(await repository.getMissingRanges()).toEqual([
        [-Infinity, 1],
        [2, Infinity],
      ])
    })

    it('finds holes with multiple records with the same block number', async () => {
      await repository.addMany([
        fakeRecord({ blockNumber: 1, blockIndex: 0 }),
        fakeRecord({ blockNumber: 1, blockIndex: 1 }),
        fakeRecord({ blockNumber: 2, blockIndex: 0 }),
      ])

      expect(await repository.getMissingRanges()).toEqual([
        [-Infinity, 1],
        [3, Infinity],
      ])
    })

    it('finds holes on a big set', async () => {
      const numbers = Array.from({ length: 200 }, () =>
        Math.floor(Math.random() * 1000),
      ).filter((x, i, a) => a.indexOf(x) === i)

      await repository.addMany(
        numbers.flatMap((number) => {
          if (Math.random() > 0.2) {
            return [
              fakeRecord({ blockNumber: number, blockIndex: 1 }),
              fakeRecord({ blockNumber: number, blockIndex: 2 }),
            ]
          }
          return [fakeRecord({ blockNumber: number })]
        }),
      )

      const ranges = await repository.getMissingRanges()

      const result = []
      for (const [start, end] of ranges) {
        for (let i = Math.max(start, 0); i < Math.min(end, 1000); i++) {
          result.push(i)
        }
      }

      const expected = []
      for (let i = 0; i < 1000; i++) {
        if (!numbers.includes(i)) {
          expected.push(i)
        }
      }

      expect(result.sort()).toEqual(expected.sort())
    })

    it('takes tip into consideration', async () => {
      await repository.addMany([
        fakeRecord({ blockNumber: 0 }),
        fakeRecord({ blockNumber: 1 }),
        fakeRecord({ blockNumber: 2 }),
        fakeRecord({ blockNumber: 6 }),
        fakeRecord({ blockNumber: 7 }),
        fakeRecord({ blockNumber: 10 }),
      ])

      await repository.refreshTip()

      expect(await repository.getMissingRanges()).toEqual([
        [-Infinity, 2],
        [3, 6],
        [8, 10],
        [11, Infinity],
      ])
    })
  })

  describe(
    ZksyncTransactionRepository.prototype.getFullySyncedDailyCounts.name,
    () => {
      it('works with empty repository', async () => {
        await repository.refreshFullySyncedDailyCounts()
        expect(await repository.getFullySyncedDailyCounts()).toEqual([])
      })

      it('skips last day', async () => {
        const start = UnixTime.now().toStartOf('day')
        const syncedCounts = [
          fakeRecord({
            blockNumber: 1,
            timestamp: start.add(1, 'hours'),
          }),
          fakeRecord({
            blockNumber: 2,
            timestamp: start.add(2, 'hours'),
          }),
        ]
        const lastDayCounts = [
          fakeRecord({
            blockNumber: 3,
            timestamp: start.add(1, 'days'),
          }),
          fakeRecord({
            blockNumber: 4,
            timestamp: start.add(1, 'days').add(1, 'hours'),
          }),
          fakeRecord({
            blockNumber: 5,
            timestamp: start.add(1, 'days').add(2, 'hours'),
          }),
        ]
        await repository.addMany([...syncedCounts, ...lastDayCounts])

        await repository.refreshTip()
        await repository.refreshFullySyncedDailyCounts()

        expect(await repository.getFullySyncedDailyCounts()).toEqual([
          {
            timestamp: start,
            count: 2,
          },
        ])
      })

      it('groups by day', async () => {
        const start = UnixTime.now().toStartOf('day')

        await repository.addMany([
          fakeRecord({
            timestamp: start.add(1, 'hours'),
            blockNumber: 1,
          }),
          fakeRecord({
            timestamp: start.add(2, 'hours'),
            blockNumber: 2,
          }),
          fakeRecord({
            timestamp: start.add(3, 'hours'),
            blockNumber: 3,
          }),
          fakeRecord({
            timestamp: start.add(1, 'days'),
            blockNumber: 4,
          }),
          fakeRecord({
            timestamp: start.add(1, 'days').add(1, 'hours'),
            blockNumber: 5,
          }),
          fakeRecord({
            timestamp: start.add(2, 'days').add(1, 'hours'),
            blockNumber: 6,
          }),
        ])

        await repository.refreshTip()
        await repository.refreshFullySyncedDailyCounts()

        expect(await repository.getFullySyncedDailyCounts()).toEqual([
          {
            count: 3,
            timestamp: start,
          },
          {
            count: 2,
            timestamp: start.add(1, 'days'),
          },
        ])
      })
    },
  )

  describe(ZksyncTransactionRepository.prototype.refreshTip.name, () => {
    it('works with empty repository', async () => {
      const tip = await repository.refreshTip()
      expect(tip).not.toBeDefined()
    })

    it('finds tip in gaps', async () => {
      const start = UnixTime.now().toStartOf('day')
      await repository.addMany([
        fakeRecord({
          blockNumber: 1,
          timestamp: start,
        }),
        fakeRecord({
          blockNumber: 2,
          timestamp: start.add(1, 'days').add(1, 'hours'),
        }),
        fakeRecord({
          blockNumber: 4,
          timestamp: start.add(2, 'days').add(1, 'hours'),
        }),
      ])

      const tip = await repository.refreshTip()

      expect(tip?.blockNumber).toEqual(2)
      expect(tip?.timestamp).toEqual(start.add(1, 'days').add(1, 'hours'))
    })

    it('finds tip without gaps', async () => {
      const start = UnixTime.now().toStartOf('day')
      await repository.addMany([
        fakeRecord({
          blockNumber: 1,
          timestamp: start,
        }),
        fakeRecord({
          blockNumber: 2,
          timestamp: start.add(1, 'days').add(1, 'hours'),
        }),
        fakeRecord({
          blockNumber: 3,
          timestamp: start.add(2, 'days').add(1, 'hours'),
        }),
      ])

      const tip = await repository.refreshTip()

      expect(tip?.blockNumber).toEqual(3)
      expect(tip?.timestamp).toEqual(start.add(2, 'days').add(1, 'hours'))
    })
  })
})

function fakeRecord(
  record?: Partial<ZksyncTransactionRecord>,
): ZksyncTransactionRecord {
  return {
    blockNumber: Math.floor(Math.random() * 1000),
    blockIndex: Math.floor(Math.random() * 100),
    timestamp: new UnixTime(Math.floor(Math.random() * 10000)),
    ...record,
  }
}
