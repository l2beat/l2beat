import { ChainId } from '@l2beat/shared-pure'
import { PostgresDatabase, Transaction } from '../../kysely'
import { VerifierStatusRecord, toRecord, toRow } from './entity'
import { selectVerifierStatus } from './select'

export class VerifierStatusRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async addOrUpdate(
    record: VerifierStatusRecord,
    trx?: Transaction,
  ): Promise<string> {
    const scope = trx ?? this.db
    const row = toRow(record)
    await scope
      .insertInto('public.verifier_status')
      .values(row)
      .onConflict((cb) =>
        cb.columns(['address', 'chain_id']).doUpdateSet({
          last_used: row.last_used,
          last_updated: row.last_updated,
        }),
      )
      .execute()

    return `[${record.address}]: ${record.lastUsed}`
  }

  async findVerifierStatus(
    address: string,
    chainId: ChainId,
  ): Promise<VerifierStatusRecord | undefined> {
    const row = await this.db
      .selectFrom('public.verifier_status')
      .select(selectVerifierStatus)
      .where('address', '=', address)
      .where('chain_id', '=', +chainId)
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async getAll(): Promise<VerifierStatusRecord[]> {
    const rows = await this.db
      .selectFrom('public.verifier_status')
      .select(selectVerifierStatus)
      .execute()

    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('public.verifier_status')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
