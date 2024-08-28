import { ChainId } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import { VerifierStatusRecord, toRecord, toRow } from './entity'
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
        .insertInto('verifier_status')
        .values(batch)
        .onConflict((cb) =>
          cb.columns(['address', 'chain_id']).doUpdateSet((eb) => ({
            last_used: eb.ref('excluded.last_used'),
            last_updated: eb.ref('excluded.last_updated'),
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
      .selectFrom('verifier_status')
      .select(selectVerifierStatus)
      .where('address', '=', address)
      .where('chain_id', '=', +chainId)
      .limit(1)
      .executeTakeFirst()
    return row && toRecord(row)
  }

  async getAll(): Promise<VerifierStatusRecord[]> {
    const rows = await this.db
      .selectFrom('verifier_status')
      .select(selectVerifierStatus)
      .execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('verifier_status')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
