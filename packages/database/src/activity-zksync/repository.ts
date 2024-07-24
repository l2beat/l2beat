import { UnixTime } from '@l2beat/shared-pure'
import { PostgresDatabase, Transaction } from '../kysely'
import { ZkSyncTransactionRecord, toRecord, toRow } from './entity'
import { selectZksyncTransaction } from './select'

export class ZkSyncTransactionRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async addOrUpdateMany(
    records: ZkSyncTransactionRecord[],
    trx?: Transaction,
  ): Promise<number> {
    for (const record of records) {
      await this.addOrUpdate(record, trx)
    }
    return records.length
  }

  async addOrUpdate(record: ZkSyncTransactionRecord, trx?: Transaction) {
    const scope = trx ?? this.db
    const row = toRow(record)
    await scope
      .insertInto('activity.zksync')
      .values(row)
      .onConflict((cb) =>
        cb.columns(['block_number', 'block_index']).doUpdateSet((eb) => ({
          unix_timestamp: eb.ref('excluded.unix_timestamp'),
        })),
      )
      .execute()

    return `zksync-${record.blockNumber}`
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('activity.zksync')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
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

  async getAll(): Promise<ZkSyncTransactionRecord[]> {
    const rows = await this.db
      .selectFrom('activity.zksync')
      .select(selectZksyncTransaction)
      .execute()

    return rows.map(toRecord)
  }
}
