import { Logger } from '@l2beat/backend-tools'
import {
  ProjectId,
  TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'
import { AggregatedLivenessRow } from 'knex/types/tables'
import {
  BaseRepository,
  CheckConvention,
} from '../../../../../peripherals/database/BaseRepository'
import { Database } from '../../../../../peripherals/database/Database'

export type AggregatedLivenessRange = '30D' | '90D' | 'MAX'

export interface AggregatedLivenessRecord {
  projectId: string
  subtype: TrackedTxsConfigSubtype
  range: AggregatedLivenessRange
  min: number
  avg: number
  max: number
  updatedAt: UnixTime
}

export class AggregatedLivenessRepository extends BaseRepository {
  private readonly TABLE_NAME = 'aggregated_liveness'

  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<AggregatedLivenessRepository>>(this)
  }

  async addOrUpdateMany(records: AggregatedLivenessRecord[]) {
    const knex = await this.knex()
    const rows = records.map(toRow)

    await knex(this.TABLE_NAME)
      .insert(rows)
      .onConflict(['project_id', 'subtype', 'range'])
      .merge()

    return rows.length
  }

  async getByProject(
    projectId: ProjectId,
  ): Promise<AggregatedLivenessRecord[]> {
    const knex = await this.knex()
    const rows = await knex(this.TABLE_NAME).where('project_id', projectId)
    return rows.map(toRecord)
  }

  async getAll(): Promise<AggregatedLivenessRecord[]> {
    const knex = await this.knex()
    const rows = await knex(this.TABLE_NAME)
    return rows.map(toRecord)
  }

  async deleteAll() {
    const knex = await this.knex()
    return knex(this.TABLE_NAME).delete()
  }
}

function toRecord(row: AggregatedLivenessRow): AggregatedLivenessRecord {
  return {
    projectId: row.project_id,
    subtype: row.subtype as TrackedTxsConfigSubtype,
    range: row.range as AggregatedLivenessRange,
    min: row.min,
    avg: row.avg,
    max: row.max,
    updatedAt: UnixTime.fromDate(row.updated_at),
  }
}

function toRow(record: AggregatedLivenessRecord): AggregatedLivenessRow {
  return {
    project_id: record.projectId,
    subtype: record.subtype,
    range: record.range,
    min: record.min,
    avg: record.avg,
    max: record.max,
    updated_at: record.updatedAt.toDate(),
  }
}
