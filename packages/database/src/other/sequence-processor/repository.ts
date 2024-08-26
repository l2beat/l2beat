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
        .insertInto('sequence_processor')
        .values(batch)
        .onConflict((cb) =>
          cb.column('id').doUpdateSet((eb) => ({
            last_processed: eb.ref('excluded.last_processed'),
            latest: eb.ref('excluded.latest'),
            synced_once: eb.ref('excluded.synced_once'),
            updated_at: eb.ref('excluded.updated_at'),
          })),
        )
        .execute()
    })
    return records.length
  }

  async findById(id: string): Promise<SequenceProcessorRecord | undefined> {
    const row = await this.db
      .selectFrom('sequence_processor')
      .select(selectSequenceProcessor)
      .where('id', '=', id)
      .limit(1)
      .executeTakeFirst()
    return row && toRecord(row)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('sequence_processor')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
