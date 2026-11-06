import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import { BlobFeeHourlyRepository } from './BlobFeeHourlyRepository'
import type { BlobFeeRecord } from './BlobFeeRepository'

describeDatabase(BlobFeeHourlyRepository.name, (db) => {
  const repository = db.blobFeeHourly
  const HOUR = UnixTime.HOUR
  const T0 = UnixTime.toStartOf(UnixTime(1_700_000_000), 'hour')

  // Two blocks in the first hour, one in the second, none in the third, one
  // in the fourth
  const SECOND = fee(101, T0 + 12, 30n, 320n)
  const FEES = [
    fee(100, T0, 10n, 160n),
    SECOND,
    fee(102, T0 + HOUR, 50n, 800n),
    fee(103, T0 + 3 * HOUR, 70n, 1120n),
  ]

  beforeEach(async () => {
    await db.blobFee.deleteAll()
    await repository.deleteAll()
    await db.blobFee.upsertMany(FEES)
  })

  describe(BlobFeeHourlyRepository.prototype.recomputeFrom.name, () => {
    it('aggregates every hour from the given one', async () => {
      await repository.recomputeFrom(T0)

      expect(await repository.getAll()).toEqual([
        hour(T0, 2, 20n, 30n, 240n),
        hour(T0 + HOUR, 1, 50n, 50n, 800n),
        hour(T0 + 3 * HOUR, 1, 70n, 70n, 1120n),
      ])
    })

    it('leaves the hours before alone and replaces the ones from it on', async () => {
      await repository.recomputeFrom(T0)
      await db.blobFee.deleteAfter(102)
      await db.blobFee.upsertMany([
        { ...SECOND, blobBaseFee: 1n },
        fee(104, T0 + HOUR + 12, 150n, 800n),
      ])

      await repository.recomputeFrom(T0 + HOUR)

      expect(await repository.getAll()).toEqual([
        hour(T0, 2, 20n, 30n, 240n),
        hour(T0 + HOUR, 2, 100n, 150n, 800n),
      ])
    })

    it('starts from the hour the timestamp is in', async () => {
      await repository.recomputeFrom(T0 + 3 * HOUR + 12)

      expect(await repository.getAll()).toEqual([
        hour(T0 + 3 * HOUR, 1, 70n, 70n, 1120n),
      ])
    })
  })

  describe(BlobFeeHourlyRepository.prototype.getByTimeRange.name, () => {
    it('returns the hours from the start included to the end excluded', async () => {
      await repository.recomputeFrom(T0)

      expect(await repository.getByTimeRange(T0 + HOUR, T0 + 3 * HOUR)).toEqual(
        [hour(T0 + HOUR, 1, 50n, 50n, 800n)],
      )
    })
  })
})

function fee(
  blockNumber: number,
  timestamp: number,
  blobBaseFee: bigint,
  baseFeePerGas: bigint,
): BlobFeeRecord {
  return {
    blockNumber,
    timestamp: UnixTime(timestamp),
    blobBaseFee,
    baseFeePerGas,
  }
}

function hour(
  timestamp: number,
  blocks: number,
  avgBlobBaseFee: bigint,
  maxBlobBaseFee: bigint,
  avgBaseFeePerGas: bigint,
) {
  return {
    timestamp: UnixTime(timestamp),
    blocks,
    avgBlobBaseFee,
    maxBlobBaseFee,
    avgBaseFeePerGas,
  }
}
