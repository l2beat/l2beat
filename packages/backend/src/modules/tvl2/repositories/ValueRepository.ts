import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'

import {
  BaseRepository,
  CheckConvention,
} from '../../../peripherals/database/BaseRepository'
import { Database } from '../../../peripherals/database/Database'

export interface ValueRow {
  project_id: string
  timestamp: Date
  data_source: string
  external: string
  canonical: string
  native: string
}

export interface ValueRecord {
  projectId: ProjectId
  timestamp: UnixTime
  dataSource: string
  external: bigint
  canonical: bigint
  native: bigint
}

export class ValueRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<ValueRepository>>(this)
  }

  async getDailyForProjects(projectIds: ProjectId[]) {
    const knex = await this.knex()
    const rows = await knex('values')
      .whereIn(
        'project_id',
        projectIds.map((id) => id.toString()),
      )
      .andWhereRaw(`extract(hour from "timestamp") % 24 = 0`)
      .orderBy('timestamp', 'asc')
    return rows.map(toRecord)
  }

  async addMany(records: ValueRecord[]) {
    const rows: ValueRow[] = records.map(toRow)
    const knex = await this.knex()
    await knex.batchInsert('values', rows, 10_000)
    return rows.length
  }

  async addOrUpdate(record: ValueRecord) {
    const knex = await this.knex()
    const row = toRow(record)
    await knex('values')
      .insert(row)
      .onConflict(['project_id', 'timestamp', 'data_source'])
      .merge()
    return row.project_id
  }

  // #region methods used only in tests

  async getAll(): Promise<ValueRecord[]> {
    const knex = await this.knex()
    const rows = await knex('values')
    return rows.map(toRecord)
  }

  async deleteAll() {
    const knex = await this.knex()
    return knex('values').delete()
  }

  // #endregion
}

function toRecord(row: ValueRow): ValueRecord {
  return {
    projectId: ProjectId(row.project_id),
    timestamp: UnixTime.fromDate(row.timestamp),
    dataSource: row.data_source,
    native: BigInt(row.native),
    canonical: BigInt(row.canonical),
    external: BigInt(row.external),
  }
}

function toRow(record: ValueRecord): ValueRow {
  return {
    project_id: record.projectId.toString(),
    timestamp: record.timestamp.toDate(),
    data_source: record.dataSource,
    native: record.native.toString(),
    canonical: record.canonical.toString(),
    external: record.external.toString(),
  }
}
