import { UnixTime } from '@l2beat/shared-pure'
import { PostgresDatabase, Transaction } from '../kysely'
import { ZksyncTransaction, toRecord, toRow } from './entity'
import { selectZksyncTransaction } from './select'

export class ZksyncTransactionRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async addOrUpdateMany(
    records: ZksyncTransaction[],
    trx?: Transaction,
  ): Promise<number> {
    const scope = trx ?? this.db
    for (const record of records) {
      await this.addOrUpdate(record, scope)
    }
    return records.length
  }

  async addOrUpdate(
    record: ZksyncTransaction,
    trx?: Transaction | PostgresDatabase,
  ) {
    const scope = trx ?? this.db
    const row = toRow(record)
    await scope
      .insertInto('activity.zksync')
      .values(row)
      .onConflict((cb) =>
        cb.columns(['block_number', 'block_index']).doUpdateSet({
          unix_timestamp: row.unix_timestamp,
        }),
      )
      .execute()

    return `zksync-${record.blockNumber}`
  }

  async deleteAll() {
    await this.db.deleteFrom('activity.zksync').execute()
  }

  async findLastTimestamp(): Promise<UnixTime | undefined> {
    const row = await this.db
      .selectFrom('activity.zksync')
      .select(['unix_timestamp'])
      .orderBy('block_number', 'desc')
      .orderBy('block_index', 'desc')
      .executeTakeFirst()

    return row ? UnixTime.fromDate(row.unix_timestamp) : undefined
  }

  async getAll(): Promise<ZksyncTransaction[]> {
    const rows = await this.db
      .selectFrom('activity.zksync')
      .select(selectZksyncTransaction)
      .execute()

    return rows.map(toRecord)
  }
}
