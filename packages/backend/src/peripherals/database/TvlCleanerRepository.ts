import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { Knex } from 'knex'
import { TvlCleanerRow } from 'knex/types/tables'

import { BaseRepository, CheckConvention } from './BaseRepository'
import { Database } from './Database'

export interface TvlCleanerRecord {
  repositoryName: string
  hourlyCleanedUntil: UnixTime
  sixHourlyCleanedUntil: UnixTime
}

export class TvlCleanerRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<TvlCleanerRepository>>(this)
  }

  async addOrUpdate(record: TvlCleanerRecord, trx?: Knex.Transaction) {
    const knex = await this.knex(trx)
    await knex('tvl_cleaner')
      .insert(toRow(record))
      .onConflict('repository_name')
      .merge()
    return record.repositoryName
  }

  async find(repositoryName: string): Promise<TvlCleanerRecord | undefined> {
    const knex = await this.knex()
    const row = await knex('tvl_cleaner')
      .where('repository_name', '=', repositoryName)
      .first()

    return row ? toRecord(row) : undefined
  }

  async deleteAll() {
    const knex = await this.knex()
    return knex('tvl_cleaner').delete()
  }
}

function toRow(record: TvlCleanerRecord): TvlCleanerRow {
  return {
    repository_name: record.repositoryName,
    hourly_cleaned_until: record.hourlyCleanedUntil.toDate(),
    six_hourly_cleaned_until: record.sixHourlyCleanedUntil.toDate(),
  }
}

function toRecord(row: TvlCleanerRow): TvlCleanerRecord {
  return {
    repositoryName: row.repository_name,
    hourlyCleanedUntil: UnixTime.fromDate(row.hourly_cleaned_until),
    sixHourlyCleanedUntil: UnixTime.fromDate(row.six_hourly_cleaned_until),
  }
}
