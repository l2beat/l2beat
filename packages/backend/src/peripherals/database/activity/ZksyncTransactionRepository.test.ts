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

  describe(ZksyncTransactionRepository.prototype.add.name, () => {
    it('merges on conflict', async () => {
      await repository.add(mockRecord(0))
      await repository.add(mockRecord(0))

      const rows = await repository.getAll()

      expect(rows).toEqual([mockRecord(0)])
    })
  })
})

const mockRecord = (offset: number) => ({
  blockIndex: 1 + offset,
  blockNumber: 100 + offset,
  timestamp: new UnixTime(1000 + offset),
})
