import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../../test/database'
import { ZkSyncTransactionRepository } from './repository'

describeDatabase(ZkSyncTransactionRepository.name, (db) => {
  const repository = db.zkSyncTransactionCount

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(ZkSyncTransactionRepository.prototype.upsertMany.name, () => {
    it('adds multiple records', async () => {
      const records = [mockRecord(1, 100), mockRecord(2, 200)]
      await repository.upsertMany(records)

      const rows = await repository.getAll()
      expect(rows).toEqual(records)
    })

    it('updates multiple records', async () => {
      const records1 = [mockRecord(1, 100), mockRecord(2, 200)]
      await repository.upsertMany(records1)
      const records2 = [mockRecord(1, 101), mockRecord(2, 202)]
      await repository.upsertMany(records2)

      const rows = await repository.getAll()
      expect(rows).toEqual(records2)
    })
  })
})

const mockRecord = (offset: number, offset2?: number) => ({
  blockIndex: 1 + offset,
  blockNumber: 100 + offset,
  timestamp: new UnixTime(1000 + (offset2 ?? offset)),
})
