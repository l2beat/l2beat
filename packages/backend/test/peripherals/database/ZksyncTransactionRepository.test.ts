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

  describe(ZksyncTransactionRepository.prototype.getGaps.name, () => {
    it('works with no data', async () => {
      expect(await repository.getGaps()).toEqual([])
    })

    it('finds gaps', async () => {
      const maxNumber = 1000
      const numbers = Array.from({ length: 200 }, () =>
        Math.floor(Math.random() * maxNumber),
      ).filter((x, i, a) => a.indexOf(x) === i)

      await repository.addMany(
        numbers.map((number) => fakeRecord({ blockNumber: number })),
      )

      const gaps = await repository.getGaps()

      for (const [start, end] of gaps) {
        for (let i = start; i <= end; i++) {
          expect(numbers.includes(i)).toEqual(false)
        }
      }
    })
  })

  describe(ZksyncTransactionRepository.prototype.findBoundaries.name, () => {
    it('works with no data', async () => {
      expect(await repository.findBoundaries()).not.toBeDefined()
    })

    it('returns min and max', async () => {
      await repository.addMany([
        fakeRecord({ blockNumber: 1 }),
        fakeRecord({ blockNumber: 3 }),
        fakeRecord({ blockNumber: 6 }),
        fakeRecord({ blockNumber: 100 }),
      ])

      const boundaries = await repository.findBoundaries()

      expect(boundaries).toEqual({ min: 1, max: 100 })
    })
  })

  describe(ZksyncTransactionRepository.prototype.getDailyCounts.name, () => {
    it('works with empty repository', async () => {
      await repository.refreshDailyCounts()
      expect(await repository.getDailyCounts()).toEqual([])
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

      await repository.refreshDailyCounts()

      expect(await repository.getDailyCounts()).toEqual([
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

      await repository.refreshDailyCounts()

      expect(await repository.getDailyCounts()).toEqual([
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
