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
  external_for_total: string
  canonical: string
  canonical_for_total: string
  native: string
  native_for_total: string
}

export interface ValueRecord {
  projectId: ProjectId
  timestamp: UnixTime
  dataSource: string
  canonical: bigint
  canonicalForTotal: bigint
  external: bigint
  externalForTotal: bigint
  native: bigint
  nativeForTotal: bigint
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

  async getSixHourlyForProjects(projectIds: ProjectId[], from: UnixTime) {
    const knex = await this.knex()
    const rows = await knex('values')
      .whereIn(
        'project_id',
        projectIds.map((id) => id.toString()),
      )
      .andWhereRaw(`extract(hour from "timestamp") % 6 = 0`)
      .andWhere('timestamp', '>=', from.toDate())
      .orderBy('timestamp', 'asc')
    return rows.map(toRecord)
  }

  async getHourlyForProjects(projectIds: ProjectId[], from: UnixTime) {
    const knex = await this.knex()
    const rows = await knex('values')
      .whereIn(
        'project_id',
        projectIds.map((id) => id.toString()),
      )
      .andWhere('timestamp', '>=', from.toDate())
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
    nativeForTotal: BigInt(row.native_for_total),
    canonical: BigInt(row.canonical),
    canonicalForTotal: BigInt(row.canonical_for_total),
    external: BigInt(row.external),
    externalForTotal: BigInt(row.external_for_total),
  }
}

function toRow(record: ValueRecord): ValueRow {
  return {
    project_id: record.projectId.toString(),
    timestamp: record.timestamp.toDate(),
    data_source: record.dataSource,
    native: record.native.toString(),
    native_for_total: record.nativeForTotal.toString(),
    canonical: record.canonical.toString(),
    canonical_for_total: record.canonicalForTotal.toString(),
    external: record.external.toString(),
    external_for_total: record.externalForTotal.toString(),
  }
}
