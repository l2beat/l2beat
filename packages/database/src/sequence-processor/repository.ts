import { PostgresDatabase, Transaction } from '../kysely'
import { SequenceProcessor, toRecord, toRow } from './entitiy'
import { selectSequenceProcessor } from './select'

export class SequenceProcessorRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async addOrUpdate(record: SequenceProcessor, trx?: Transaction) {
    const scope = trx ?? this.db
    const row = toRow(record)
    const { id, ...rest } = row
    await scope
      .insertInto('public.sequence_processor')
      .values(row)
      .onConflict((cb) => cb.column('id').doUpdateSet(rest))
      .execute()
    return record.id
  }

  async findById(id: string) {
    const row = await this.db
      .selectFrom('public.sequence_processor')
      .select(selectSequenceProcessor)
      .where('id', '=', id)
      .executeTakeFirst()

    return row ? toRecord(row) : null
  }

  deleteAll() {
    return this.db.deleteFrom('public.sequence_processor').execute()
  }
}
