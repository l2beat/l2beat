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
  })

  describe(ZksyncTransactionRepository.prototype.getAll.name, () => {
    it('gets one record', async () => {
      const record = fakeRecord()
      await repository.add(record)

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
  })

  describe(
    ZksyncTransactionRepository.prototype.getDailyTransactionCount.name,
    () => {
      it('works with empty repository', async () => {
        await repository.refreshDailyTransactionCount()
        expect(
          await repository.getDailyTransactionCount(UnixTime.now()),
        ).toEqual([])
      })

      it('groups by day', async () => {
        const start = UnixTime.now().toStartOf('day')

        await repository.addMany([
          fakeRecord({
            timestamp: start.add(1, 'hours'),
          }),
          fakeRecord({
            timestamp: start.add(2, 'hours'),
          }),
          fakeRecord({
            timestamp: start.add(3, 'hours'),
          }),
          fakeRecord({
            timestamp: start.add(1, 'days'),
          }),
          fakeRecord({
            timestamp: start.add(1, 'days').add(1, 'hours'),
          }),
        ])

        await repository.refreshDailyTransactionCount()
        expect(
          await repository.getDailyTransactionCount(start.add(2, 'days')),
        ).toEqual([
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

      it('orders by day', async () => {
        const start = UnixTime.now().toStartOf('day')

        await repository.addMany([
          fakeRecord({
            timestamp: start.add(1, 'days'),
          }),
          fakeRecord({
            timestamp: start,
          }),
        ])

        await repository.refreshDailyTransactionCount()
        expect(
          await repository.getDailyTransactionCount(start.add(2, 'days')),
        ).toEqual([
          {
            count: 1,
            timestamp: start,
          },
          {
            count: 1,
            timestamp: start.add(1, 'days'),
          },
        ])
      })

      it('skips records from today', async () => {
        const today = UnixTime.now().toStartOf('day')

        await repository.addMany([
          fakeRecord({
            timestamp: today.add(-1, 'days'),
          }),
          fakeRecord({
            timestamp: today,
          }),
        ])

        await repository.refreshDailyTransactionCount()
        expect(await repository.getDailyTransactionCount(today)).toEqual([
          {
            count: 1,
            timestamp: today.add(-1, 'days'),
          },
        ])
      })
    },
  )
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
