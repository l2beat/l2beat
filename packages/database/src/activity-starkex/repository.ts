import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { PostgresDatabase, Transaction } from '../kysely'
import { StarkExTransactionCount, toRecord, toRow } from './entity'
import { selectStarkExTransactionCount } from './select'

export class StarkExTransactionCountRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async addOrUpdateMany(records: StarkExTransactionCount[], trx?: Transaction) {
    for (const record of records) {
      await this.addOrUpdate(record, trx)
    }
    return records.length
  }

  async addOrUpdate(record: StarkExTransactionCount, trx?: Transaction) {
    const scope = trx ?? this.db
    await scope
      .insertInto('activity.starkex')
      .values(toRow(record))
      .onConflict((cb) =>
        cb.columns(['project_id', 'unix_timestamp']).doUpdateSet({
          count: record.count,
        }),
      )
      .execute()

    return `${record.projectId.toString()}-${record.timestamp.toString()}`
  }

  async deleteAll() {
    await this.db.deleteFrom('activity.starkex').execute()
  }

  async findLastTimestampByProjectId(projectId: ProjectId) {
    const row = await this.db
      .selectFrom('activity.starkex')
      .select('unix_timestamp')
      .where('project_id', '=', projectId.toString())
      .orderBy('unix_timestamp', 'desc')
      .limit(1)
      .executeTakeFirst()

    return row ? UnixTime.fromDate(row.unix_timestamp) : undefined
  }

  async getAll() {
    const rows = await this.db
      .selectFrom('activity.starkex')
      .select(selectStarkExTransactionCount)
      .execute()

    return rows.map(toRecord)
  }
}
