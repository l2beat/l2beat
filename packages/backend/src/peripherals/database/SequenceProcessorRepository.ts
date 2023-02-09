import { Logger } from '@l2beat/shared'
import { Knex } from 'knex'
import { SequenceProcessorRow } from 'knex/types/tables'

import { BaseRepository, CheckConvention } from './shared/BaseRepository'
import { Database } from './shared/Database'

export interface SequenceProcessorRecord {
  id: string
  lastProcessed: number
  latest: number
}

export class SequenceProcessorRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<SequenceProcessorRepository>>(this)
  }

  async addOrUpdate(record: SequenceProcessorRecord, trx?: Knex.Transaction) {
    const knex = await this.knex(trx)
    await knex('sequence_processor')
      .insert(toRow(record))
      .onConflict('id')
      .merge()
    return record.id
  }

  async findById(id: string): Promise<SequenceProcessorRecord | undefined> {
    const knex = await this.knex()
    const row = await knex('sequence_processor').where('id', id).first()
    return row ? toRecord(row) : undefined
  }

  async deleteAll() {
    const knex = await this.knex()
    return await knex('sequence_processor').delete()
  }
}

function toRow(record: SequenceProcessorRecord): SequenceProcessorRow {
  return {
    id: record.id,
    last_processed: record.lastProcessed,
    latest: record.latest,
    updated_at: new Date(),
  }
}

function toRecord(row: SequenceProcessorRow): SequenceProcessorRecord {
  return {
    id: row.id,
    lastProcessed: row.last_processed,
    latest: row.latest,
  }
}
