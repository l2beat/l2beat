import { BaseRepository } from '../../BaseRepository'
import { TvlCleanerRecord, toRecord, toRow } from './entity'
import { selectTvlCleaner } from './select'

export class TvlCleanerRepository extends BaseRepository {
  async upsert(record: TvlCleanerRecord) {
    const row = toRow(record)
    await this.db
      .insertInto('public.tvl_cleaner')
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
      .selectFrom('public.tvl_cleaner')
      .select(selectTvlCleaner)
      .where('repository_name', '=', repositoryName)
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('public.tvl_cleaner')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
