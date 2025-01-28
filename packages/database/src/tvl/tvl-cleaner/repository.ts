import { BaseRepository } from '../../BaseRepository'
import { type TvlCleanerRecord, toRecord, toRow } from './entity'
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
        .insertInto('TvlCleaner')
        .values(batch)
        .onConflict((cb) =>
          cb.column('repositoryName').doUpdateSet((eb) => ({
            hourlyCleanedUntil: eb.ref('excluded.hourlyCleanedUntil'),
            sixHourlyCleanedUntil: eb.ref('excluded.sixHourlyCleanedUntil'),
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
      .selectFrom('TvlCleaner')
      .select(selectTvlCleaner)
      .where('repositoryName', '=', repositoryName)
      .limit(1)
      .executeTakeFirst()
    return row && toRecord(row)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('TvlCleaner').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
