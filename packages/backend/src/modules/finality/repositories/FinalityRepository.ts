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
  minimumTimeToInclusion: number
  maximumTimeToInclusion: number
  averageTimeToInclusion: number
}

export interface ProjectFinalityRecord {
  minimumTimeToInclusion: number
  maximumTimeToInclusion: number
  averageTimeToInclusion: number
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

  async findLatestByProjectId(
    projectId: ProjectId,
  ): Promise<FinalityRecord | undefined> {
    const knex = await this.knex()
    const row = await knex('finality')
      .where('project_id', projectId.toString())
      .orderBy('timestamp', 'desc')
      .first()
    return row ? toRecord(row) : undefined
  }

  async findProjectFinalityOnTimestamp(
    projectId: ProjectId,
    timestamp: UnixTime,
  ): Promise<ProjectFinalityRecord | undefined> {
    const knex = await this.knex()
    const row = await knex('finality')
      .where('timestamp', timestamp.toDate())
      .where('project_id', projectId.toString())
      .first()
    return row ? toProjectFinalityRecord(row) : undefined
  }

  async getLatestGroupedByProjectId(
    projectIds: ProjectId[],
  ): Promise<FinalityRecord[]> {
    const knex = await this.knex()

    const maxTimestampSubquery = knex('finality')
      .select('project_id')
      .max('timestamp as max_timestamp')
      .whereIn(
        'project_id',
        projectIds?.map((p) => p.toString()),
      )
      .groupBy('project_id')
      .as('max_f')

    const query: FinalityRow[] = await knex('finality as f').join(
      maxTimestampSubquery,
      function () {
        this.on('f.project_id', '=', 'max_f.project_id').andOn(
          'f.timestamp',
          '=',
          'max_f.max_timestamp',
        )
      },
    )

    return query.map(toRecord)
  }

  async addMany(
    records: FinalityRecord[],
    trx?: Knex.Transaction,
  ): Promise<number> {
    const knex = await this.knex(trx)
    const rows: FinalityRow[] = records.map(toRow)
    await knex.batchInsert('finality', rows, 10_000)
    return rows.length
  }

  async add(record: FinalityRecord, trx?: Knex.Transaction): Promise<string> {
    const knex = await this.knex(trx)

    const row: FinalityRow = toRow(record)
    const [inserted] = await knex('finality')
      .insert(row)
      .returning('project_id')

    return inserted.project_id
  }

  async deleteAll() {
    const knex = await this.knex()
    return knex('finality').delete()
  }
}

function toProjectFinalityRecord(row: FinalityRow): ProjectFinalityRecord {
  return {
    minimumTimeToInclusion: row.minimum_time_to_inclusion,
    maximumTimeToInclusion: row.maximum_time_to_inclusion,
    averageTimeToInclusion: row.average_time_to_inclusion,
  }
}

function toRecord(row: FinalityRow): FinalityRecord {
  return {
    projectId: ProjectId(row.project_id),
    timestamp: UnixTime.fromDate(row.timestamp),
    minimumTimeToInclusion: row.minimum_time_to_inclusion,
    maximumTimeToInclusion: row.maximum_time_to_inclusion,
    averageTimeToInclusion: row.average_time_to_inclusion,
  }
}

function toRow(record: FinalityRecord): FinalityRow {
  return {
    project_id: record.projectId.toString(),
    timestamp: record.timestamp.toDate(),
    minimum_time_to_inclusion: record.minimumTimeToInclusion,
    maximum_time_to_inclusion: record.maximumTimeToInclusion,
    average_time_to_inclusion: record.averageTimeToInclusion,
  }
}
