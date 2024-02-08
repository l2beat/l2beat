import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { Knex } from 'knex'
import { FinalityRow } from 'knex/types/tables'

import {
  BaseRepository,
  CheckConvention,
} from '../../../peripherals/database/BaseRepository'
import { Database } from '../../../peripherals/database/Database'

export interface FinalityRecord {
  projectId: ProjectId
  timestamp: UnixTime
  minimum: number
  maximum: number
  average: number
}

export class FinalityRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<FinalityRepository>>(this)
  }

  async getAll(): Promise<FinalityRecord[]> {
    const knex = await this.knex()
    const rows = await knex('finality')
    return rows.map(toRecord)
  }

  async getProjectsSyncedOnTimestamp(
    timestamp: UnixTime,
  ): Promise<ProjectId[]> {
    const knex = await this.knex()
    const rows = await knex('finality').where('timestamp', timestamp.toDate())
    return rows.map((row) => ProjectId(row.project_id))
  }

  async addMany(
    transactions: FinalityRecord[],
    trx?: Knex.Transaction,
  ): Promise<number> {
    const knex = await this.knex(trx)
    const rows: FinalityRow[] = transactions.map(toRow)
    await knex.batchInsert('finality', rows, 10_000)
    return rows.length
  }

  async deleteAll() {
    const knex = await this.knex()
    return knex('finality').delete()
  }
}

function toRecord(row: FinalityRow): FinalityRecord {
  return {
    projectId: ProjectId(row.project_id),
    timestamp: UnixTime.fromDate(row.timestamp),
    minimum: row.minimum,
    maximum: row.maximum,
    average: row.average,
  }
}

function toRow(record: FinalityRecord): FinalityRow {
  return {
    project_id: record.projectId.toString(),
    timestamp: record.timestamp.toDate(),
    minimum: record.minimum,
    maximum: record.maximum,
    average: record.average,
  }
}
