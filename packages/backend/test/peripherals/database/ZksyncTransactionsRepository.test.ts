import { Logger } from '@l2beat/common'
import { UnixTime } from '@l2beat/types'
import { expect } from 'earljs'

import {
  ZksyncTransactionRecord,
  ZksyncTransactionsRepository,
} from '../../../src/peripherals/database/ZksyncTransactionsRepository'
import { setupDatabaseTestSuite } from './shared/setup'

describe(ZksyncTransactionsRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const repository = new ZksyncTransactionsRepository(database, Logger.SILENT)

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(ZksyncTransactionsRepository.prototype.getAll.name, () => {
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
