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
  external: number
  canonical: number
  native: number
}

export interface ValueRecord {
  projectId: ProjectId
  timestamp: UnixTime
  external: number
  canonical: number
  native: number
}

export class ValueRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<ValueRepository>>(this)
  }

  async addMany(records: ValueRecord[]) {
    const rows: ValueRow[] = records.map(toRow)
    const knex = await this.knex()
    await knex.batchInsert('values', rows, 10_000)
    return rows.length
  }

  async add(record: ValueRecord) {
    const knex = await this.knex()
    const row = toRow(record)
    await knex.insert(row)
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
    native: row.native,
    canonical: row.canonical,
    external: row.external,
  }
}

function toRow(record: ValueRecord): ValueRow {
  return {
    project_id: record.projectId.toString(),
    timestamp: record.timestamp.toDate(),
    native: record.native,
    canonical: record.canonical,
    external: record.external
  }
}
