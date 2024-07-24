import { PostgresDatabase, Transaction } from '../kysely'
import { SequenceProcessorRecord, toRecord, toRow } from './entity'
import { selectSequenceProcessor } from './select'

export class SequenceProcessorRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async addOrUpdate(record: SequenceProcessorRecord, trx?: Transaction) {
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

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('public.sequence_processor')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
