import { BaseRepository } from '../../BaseRepository'
import { SequenceProcessorRecord, toRecord, toRow } from './entity'
import { selectSequenceProcessor } from './select'

export class SequenceProcessorRepository extends BaseRepository {
  async addOrUpdate(record: SequenceProcessorRecord) {
    const row = toRow(record)
    await this.getDb()
      .insertInto('public.sequence_processor')
      .values(row)
      .onConflict((cb) =>
        cb.column('id').doUpdateSet((eb) => ({
          last_processed: eb.ref('excluded.last_processed'),
          latest: eb.ref('excluded.latest'),
          synced_once: eb.ref('excluded.synced_once'),
          updated_at: eb.ref('excluded.updated_at'),
        })),
      )
      .execute()
    return record.id
  }

  async findById(id: string) {
    const row = await this.getDb()
      .selectFrom('public.sequence_processor')
      .select(selectSequenceProcessor)
      .where('id', '=', id)
      .executeTakeFirst()

    return row ? toRecord(row) : null
  }

  async deleteAll(): Promise<number> {
    const result = await this.getDb()
      .deleteFrom('public.sequence_processor')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
