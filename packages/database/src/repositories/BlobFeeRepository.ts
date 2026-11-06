import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { BlobFee } from '../kysely/generated/types'

/** Fees of one Ethereum block */
export interface BlobFeeRecord {
  blockNumber: number
  timestamp: UnixTime
  /** Wei per blob gas */
  blobBaseFee: bigint
  /** Wei per gas */
  baseFeePerGas: bigint
}

export function toRecord(row: Selectable<BlobFee>): BlobFeeRecord {
  return {
    blockNumber: row.blockNumber,
    timestamp: UnixTime.fromDate(row.timestamp),
    blobBaseFee: BigInt(row.blobBaseFee),
    baseFeePerGas: BigInt(row.baseFeePerGas),
  }
}

export function toRow(record: BlobFeeRecord): Insertable<BlobFee> {
  return {
    blockNumber: record.blockNumber,
    timestamp: UnixTime.toDate(record.timestamp),
    blobBaseFee: record.blobBaseFee.toString(),
    baseFeePerGas: record.baseFeePerGas.toString(),
  }
}

export class BlobFeeRepository extends BaseRepository {
  async upsertMany(records: BlobFeeRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 5_000, async (batch) => {
      await this.db
        .insertInto('BlobFee')
        .values(batch)
        .onConflict((cb) =>
          cb.column('blockNumber').doUpdateSet((eb) => ({
            timestamp: eb.ref('excluded.timestamp'),
            blobBaseFee: eb.ref('excluded.blobBaseFee'),
            baseFeePerGas: eb.ref('excluded.baseFeePerGas'),
          })),
        )
        .execute()
    })
    return records.length
  }

  /** Both ends included, by block number */
  async getByBlockRange(from: number, to: number): Promise<BlobFeeRecord[]> {
    const rows = await this.db
      .selectFrom('BlobFee')
      .selectAll()
      .where('blockNumber', '>=', from)
      .where('blockNumber', '<=', to)
      .orderBy('blockNumber', 'asc')
      .execute()
    return rows.map(toRecord)
  }

  async findByBlockNumber(
    blockNumber: number,
  ): Promise<BlobFeeRecord | undefined> {
    const row = await this.db
      .selectFrom('BlobFee')
      .selectAll()
      .where('blockNumber', '=', blockNumber)
      .executeTakeFirst()
    return row && toRecord(row)
  }

  async deleteAfter(blockNumber: number): Promise<number> {
    const result = await this.db
      .deleteFrom('BlobFee')
      .where('blockNumber', '>', blockNumber)
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getAll(): Promise<BlobFeeRecord[]> {
    const rows = await this.db
      .selectFrom('BlobFee')
      .selectAll()
      .orderBy('blockNumber', 'asc')
      .execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('BlobFee').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
