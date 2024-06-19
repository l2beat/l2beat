import { ChainId } from '@l2beat/shared-pure'
import { PostgresDatabase, Transaction } from '../kysely'
import { VerifierStatus, toRecord, toRow } from './entity'
import { selectVerifierStatus } from './select'

export class VerifierStatusRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async addOrUpdate(
    record: VerifierStatus,
    trx?: Transaction,
  ): Promise<string> {
    const scope = trx ?? this.db
    const row = toRow(record)
    await scope
      .insertInto('verifier_status')
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
  ): Promise<VerifierStatus | undefined> {
    const row = await this.db
      .selectFrom('verifier_status')
      .select(selectVerifierStatus)
      .where((eb) =>
        eb.and([eb('address', '=', address), eb('chain_id', '=', +chainId)]),
      )
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async getAll(): Promise<VerifierStatus[]> {
    const rows = await this.db
      .selectFrom('verifier_status')
      .select(selectVerifierStatus)
      .execute()

    return rows.map(toRecord)
  }

  deleteAll() {
    return this.db.deleteFrom('verifier_status').execute()
  }
}
