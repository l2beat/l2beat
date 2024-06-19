import { PostgresDatabase, Transaction } from '../kysely'
import { TvlCleaner, toRecord, toRow } from './entity'
import { selectTvlCleaner } from './select'

export class TvlCleanerRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async addOrUpdate(record: TvlCleaner, trx?: Transaction) {
    const scope = trx ?? this.db

    const row = toRow(record)
    await scope
      .insertInto('tvl_cleaner')
      .values(row)
      .onConflict((cb) =>
        cb.column('repository_name').doUpdateSet({
          hourly_cleaned_until: row.hourly_cleaned_until,
          six_hourly_cleaned_until: row.six_hourly_cleaned_until,
        }),
      )
      .execute()

    return record.repositoryName
  }

  async find(repositoryName: string) {
    const row = await this.db
      .selectFrom('tvl_cleaner')
      .select(selectTvlCleaner)
      .where('repository_name', '=', repositoryName)
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  deleteAll() {
    return this.db.deleteFrom('tvl_cleaner').execute()
  }
}
