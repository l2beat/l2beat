import { BaseRepository } from '../../BaseRepository'
import { SequenceProcessorRecord, toRecord, toRow } from './entity'
import { selectSequenceProcessor } from './select'

export class SequenceProcessorRepository extends BaseRepository {
  async upsert(record: SequenceProcessorRecord): Promise<void> {
    await this.upsertMany([record])
  }

  async upsertMany(records: SequenceProcessorRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('SequenceProcessor')
        .values(batch)
        .onConflict((cb) =>
          cb.column('id').doUpdateSet((eb) => ({
            last_processed: eb.ref('excluded.lastProcessed'),
            latest: eb.ref('excluded.latest'),
            synced_once: eb.ref('excluded.syncedOnce'),
            updated_at: eb.ref('excluded.updatedAt'),
          })),
        )
        .execute()
    })
    return records.length
  }

  async findById(id: string): Promise<SequenceProcessorRecord | undefined> {
    const row = await this.db
      .selectFrom('SequenceProcessor')
      .select(selectSequenceProcessor)
      .where('id', '=', id)
      .limit(1)
      .executeTakeFirst()
    return row && toRecord(row)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('SequenceProcessor')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
