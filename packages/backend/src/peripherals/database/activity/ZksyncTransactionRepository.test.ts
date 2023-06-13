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

  it(ZksyncTransactionRepository.prototype.addMany.name, async () => {
    const records = [mockRecord(0), mockRecord(1)]

    await repository.addMany(records)

    const rows = await repository.getAll()

    expect(rows).toEqual(records)
  })
})

const mockRecord = (offset: number) => ({
  blockIndex: 1 + offset,
  blockNumber: 100 + offset,
  timestamp: new UnixTime(1000 + offset),
})
