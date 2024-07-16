import { Logger } from '@l2beat/backend-tools'
import {
  ProjectId,
  TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'
import { AnomaliesRow } from 'knex/types/tables'
import {
  BaseRepository,
  CheckConvention,
} from '../../../../../peripherals/database/BaseRepository'
import { Database } from '../../../../../peripherals/database/Database'

export interface AnomaliesRecord {
  timestamp: UnixTime
  projectId: string
  subtype: TrackedTxsConfigSubtype
  duration: number
}

export class AnomaliesRepository extends BaseRepository {
  private readonly TABLE_NAME = 'anomalies'

  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<AnomaliesRepository>>(this)
  }

  async addOrUpdateMany(records: AnomaliesRecord[]) {
    const knex = await this.knex()
    const rows = records.map(toRow)

    await knex(this.TABLE_NAME)
      .insert(rows)
      .onConflict(['timestamp', 'project_id', 'subtype'])
      .merge()

    return rows.length
  }

  async getAll(): Promise<AnomaliesRecord[]> {
    const knex = await this.knex()
    const rows = await knex(this.TABLE_NAME)
    return rows.map(toRecord)
  }

  async getByProjectFrom(
    projectId: ProjectId,
    from: UnixTime,
  ): Promise<AnomaliesRecord[]> {
    const knex = await this.knex()
    const rows = await knex(this.TABLE_NAME)
      .where('project_id', projectId)
      .andWhere('timestamp', '>=', from.toDate())
    return rows.map(toRecord)
  }

  async deleteAll() {
    const knex = await this.knex()
    return knex(this.TABLE_NAME).delete()
  }
}

function toRecord(row: AnomaliesRow): AnomaliesRecord {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    projectId: row.project_id,
    subtype: row.subtype as TrackedTxsConfigSubtype,
    duration: row.duration,
  }
}

function toRow(record: AnomaliesRecord): AnomaliesRow {
  return {
    timestamp: record.timestamp.toDate(),
    project_id: record.projectId,
    subtype: record.subtype,
    duration: record.duration,
  }
}
