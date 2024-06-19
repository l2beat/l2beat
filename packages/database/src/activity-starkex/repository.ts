import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { PostgresDatabase, Transaction } from '../kysely'
import { StarkexTransactionCount, toRecord, toRow } from './entity'
import { selectStarkexTransactionCount } from './select'

export class StarkexTransactionCountRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async addOrUpdateMany(records: StarkexTransactionCount[], trx?: Transaction) {
    const scope = trx ?? this.db
    for (const record of records) {
      await this.addOrUpdate(record, scope)
    }
    return records.length
  }

  async addOrUpdate(
    record: StarkexTransactionCount,
    trx?: Transaction | PostgresDatabase,
  ) {
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
      .select(selectStarkexTransactionCount)
      .execute()

    return rows.map(toRecord)
  }
}
