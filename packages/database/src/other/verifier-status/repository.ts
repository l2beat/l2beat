import type { ChainId } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import { toRecord, toRow, type VerifierStatusRecord } from './entity'

export class VerifierStatusRepository extends BaseRepository {
  async upsert(record: VerifierStatusRecord): Promise<void> {
    await this.upsertMany([record])
  }

  async upsertMany(records: VerifierStatusRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('VerifierStatus')
        .values(batch)
        .onConflict((cb) =>
          cb.columns(['address', 'chainId']).doUpdateSet((eb) => ({
            lastUsed: eb.ref('excluded.lastUsed'),
            lastUpdated: eb.ref('excluded.lastUpdated'),
          })),
        )
        .execute()
    })
    return records.length
  }

  async findVerifierStatus(
    address: string,
    chainId: ChainId,
  ): Promise<VerifierStatusRecord | undefined> {
    const row = await this.db
      .selectFrom('VerifierStatus')
      .selectAll()
      .where('address', '=', address)
      .where('chainId', '=', +chainId)
      .limit(1)
      .executeTakeFirst()
    return row && toRecord(row)
  }

  async getVerifierStatuses(
    addresses: string[],
  ): Promise<VerifierStatusRecord[]> {
    const rows = await this.db
      .selectFrom('VerifierStatus')
      .selectAll()
      .where('address', 'in', addresses)
      .execute()
    return rows.map(toRecord)
  }

  async getAll(): Promise<VerifierStatusRecord[]> {
    const rows = await this.db
      .selectFrom('VerifierStatus')
      .selectAll()
      .execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('VerifierStatus').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
