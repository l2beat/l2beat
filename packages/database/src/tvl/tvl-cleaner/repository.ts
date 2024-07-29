import { BaseRepository } from '../../BaseRepository'
import { TvlCleanerRecord, toRecord, toRow } from './entity'
import { selectTvlCleaner } from './select'

export class TvlCleanerRepository extends BaseRepository {
  async upsert(record: TvlCleanerRecord): Promise<void> {
    await this.upsertMany([record])
  }

  async upsertMany(records: TvlCleanerRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('public.tvl_cleaner')
        .values(batch)
        .onConflict((cb) =>
          cb.column('repository_name').doUpdateSet((eb) => ({
            hourly_cleaned_until: eb.ref('excluded.hourly_cleaned_until'),
            six_hourly_cleaned_until: eb.ref(
              'excluded.six_hourly_cleaned_until',
            ),
          })),
        )
        .execute()
    })
    return records.length
  }

  async findByRepositoryName(
    repositoryName: string,
  ): Promise<TvlCleanerRecord | undefined> {
    const row = await this.db
      .selectFrom('public.tvl_cleaner')
      .select(selectTvlCleaner)
      .where('repository_name', '=', repositoryName)
      .limit(1)
      .executeTakeFirst()
    return row && toRecord(row)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('public.tvl_cleaner')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
