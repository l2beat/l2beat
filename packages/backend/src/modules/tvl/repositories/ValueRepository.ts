import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'

import { Knex } from 'knex'
import {
  BaseRepository,
  CheckConvention,
} from '../../../peripherals/database/BaseRepository'
import { Database } from '../../../peripherals/database/Database'
import {
  CleanDateRange,
  deleteHourlyUntil,
  deleteSixHourlyUntil,
} from '../utils/deleteArchivedRecords'

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

const BATCH_SIZE = 2_000

export class ValueRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<ValueRepository>>(this)
  }

  async getForProjects(projectIds: ProjectId[]) {
    const knex = await this.knex()
    const rows = await knex('values').whereIn(
      'project_id',
      projectIds.map((id) => id.toString()),
    )
    return rows.map(toRecord)
  }

  async addOrUpdateMany(records: ValueRecord[]) {
    await this.runInTransaction(async (trx) => {
      for (let i = 0; i < records.length; i += BATCH_SIZE) {
        await this._addOrUpdateMany(records.slice(i, i + BATCH_SIZE), trx)
      }
    })

    return records.length
  }

  private async _addOrUpdateMany(
    records: ValueRecord[],
    trx: Knex.Transaction,
  ) {
    const knex = await this.knex(trx)
    const rows = records.map(toRow)

    await knex('values')
      .insert(rows)
      .onConflict(['project_id', 'timestamp', 'data_source'])
      .merge()
  }

  // #region methods used only in TvlCleaner

  async deleteHourlyUntil(dateRange: CleanDateRange) {
    const knex = await this.knex()
    return deleteHourlyUntil(knex, 'values', dateRange)
  }

  async deleteSixHourlyUntil(dateRange: CleanDateRange) {
    const knex = await this.knex()
    return deleteSixHourlyUntil(knex, 'values', dateRange)
  }

  // #endregion

  // #region methods used only in tests

  async getAll(): Promise<ValueRecord[]> {
    const knex = await this.knex()
    const rows = await knex('values')
    return rows.map(toRecord)
  }

  async addMany(records: ValueRecord[], trx?: Knex.Transaction) {
    const rows: ValueRow[] = records.map(toRow)
    const knex = await this.knex(trx)
    await knex.batchInsert('values', rows, BATCH_SIZE)
    return rows.length
  }

  async deleteAll() {
    const knex = await this.knex()
    return knex('values').delete()
  }

  // #endregion

  // #region DA-BEAT - not used but added to keep repos in sync
  async getLatestValuesForProjects(
    projectIds: ProjectId[],
  ): Promise<ValueRecord[]> {
    const knex = await this.knex()

    const rows = await knex
      .with('latest_values', (cb) =>
        cb
          .select(
            '*',
            knex.raw(
              'ROW_NUMBER() OVER (PARTITION BY project_id, data_source ORDER BY timestamp DESC) as combination_number',
            ),
          )
          .whereIn(
            'project_id',
            projectIds.map((id) => id.toString()),
          )
          .from('values'),
      )
      .select('*')
      .from('latest_values')
      .andWhere('combination_number', '=', 1)

    return rows.map(toRecord)
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
