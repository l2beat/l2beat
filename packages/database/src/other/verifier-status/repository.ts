import type { ChainId } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import { type VerifierStatusRecord, toRecord, toRow } from './entity'
import { selectVerifierStatus } from './select'

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
      .select(selectVerifierStatus)
      .where('address', '=', address)
      .where('chainId', '=', +chainId)
      .limit(1)
      .executeTakeFirst()
    return row && toRecord(row)
  }

  async getAll(): Promise<VerifierStatusRecord[]> {
    const rows = await this.db
      .selectFrom('VerifierStatus')
      .select(selectVerifierStatus)
      .execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('VerifierStatus').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
