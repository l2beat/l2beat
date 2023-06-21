import { Logger } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { setupDatabaseTestSuite } from '../../../test/database'
import { ZksyncTransactionRepository } from './ZksyncTransactionRepository'

describe(ZksyncTransactionRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const repository = new ZksyncTransactionRepository(database, Logger.SILENT)

  beforeEach(async () => {
    await repository.deleteAll()
  })

  it(ZksyncTransactionRepository.prototype.addOrUpdateMany.name, async () => {
    const records = [mockRecord(0), mockRecord(1)]

    await repository.addOrUpdateMany(records)

    const rows = await repository.getAll()

    expect(rows).toEqual(records)
  })

  describe(ZksyncTransactionRepository.prototype.addOrUpdate.name, () => {
    it('merges on conflict', async () => {
      await repository.addOrUpdate(mockRecord(0))
      await repository.addOrUpdate({
        ...mockRecord(0),
        timestamp: new UnixTime(2000),
      })

      const rows = await repository.getAll()

      expect(rows).toEqual([
        {
          ...mockRecord(0),
          timestamp: new UnixTime(2000),
        },
      ])
    })
  })
})

const mockRecord = (offset: number) => ({
  blockIndex: 1 + offset,
  blockNumber: 100 + offset,
  timestamp: new UnixTime(1000 + offset),
})
