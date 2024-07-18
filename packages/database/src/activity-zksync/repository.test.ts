import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../test/database'
import { ZkSyncTransactionRepository } from './repository'

describeDatabase(ZkSyncTransactionRepository.name, (db) => {
  const repository = db.zkSyncTransactionCount

  beforeEach(async () => {
    await repository.deleteAll()
  })

  it(ZkSyncTransactionRepository.prototype.addOrUpdateMany.name, async () => {
    const records = [mockRecord(0), mockRecord(1)]

    await repository.addOrUpdateMany(records)

    const rows = await repository.getAll()

    expect(rows).toEqual(records)
  })

  describe(ZkSyncTransactionRepository.prototype.addOrUpdate.name, () => {
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
