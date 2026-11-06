import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import { type BlobFeeRecord, BlobFeeRepository } from './BlobFeeRepository'

describeDatabase(BlobFeeRepository.name, (db) => {
  const repository = db.blobFee

  const FEES = [fee(100, 1000), fee(101, 1012), fee(102, 1024)]

  beforeEach(async () => {
    await repository.deleteAll()
    await repository.upsertMany(FEES)
  })

  describe(BlobFeeRepository.prototype.upsertMany.name, () => {
    it('replaces the fees of a block fetched again', async () => {
      const refetched = {
        ...fee(102, 1024),
        blobBaseFee: 7n,
        baseFeePerGas: 8n,
      }

      await repository.upsertMany([refetched])

      expect(await repository.getAll()).toEqual([
        ...FEES.slice(0, 2),
        refetched,
      ])
    })
  })

  describe(BlobFeeRepository.prototype.getByBlockRange.name, () => {
    it('returns the blocks of the range, both ends included', async () => {
      expect(await repository.getByBlockRange(101, 102)).toEqual(FEES.slice(1))
    })
  })

  describe(BlobFeeRepository.prototype.findByBlockNumber.name, () => {
    it('finds a stored block', async () => {
      expect(await repository.findByBlockNumber(101)).toEqual(FEES[1])
    })

    it('returns undefined for a block not stored', async () => {
      expect(await repository.findByBlockNumber(103)).toEqual(undefined)
    })
  })

  describe(BlobFeeRepository.prototype.deleteAfter.name, () => {
    it('deletes the blocks above the height', async () => {
      const deleted = await repository.deleteAfter(100)

      expect(deleted).toEqual(2)
      expect(await repository.getAll()).toEqual(FEES.slice(0, 1))
    })
  })
})

function fee(blockNumber: number, timestamp: number): BlobFeeRecord {
  return {
    blockNumber,
    timestamp: UnixTime(timestamp),
    blobBaseFee: BigInt(blockNumber) * 1_000_000_000n,
    baseFeePerGas: BigInt(blockNumber) * 16_000_000_000n,
  }
}
