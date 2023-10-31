import { Logger } from '@l2beat/backend-tools'
import { LivenessType, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { LivenessConfigurationRow } from 'knex/types/tables'

import { LivenessConfigurationIdentifier } from '../../core/liveness/types/LivenessConfigurationIdentifier'
import { BaseRepository, CheckConvention } from './shared/BaseRepository'
import { Database } from './shared/Database'

export interface LivenessConfigurationRecord {
  id: number
  projectId: ProjectId
  type: LivenessType
  identifier: LivenessConfigurationIdentifier
  params: string
  fromTimestamp: UnixTime
  toTimestamp: UnixTime
  lastSyncedTimestamp: UnixTime | undefined
}

// TODO: add index when we will write controler
export class LivenessConfigurationRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<LivenessConfigurationRepository>>(this)
  }

  async getAll(): Promise<LivenessConfigurationRecord[]> {
    const knex = await this.knex()
    const rows = await knex('liveness_configuration')
    return rows.map(toRecord)
  }

  async addMany(
    records: Omit<LivenessConfigurationRecord, 'id' | 'lastSyncedTimestamp'>[],
  ): Promise<number[]> {
    const knex = await this.knex()

    const insertedRows = await knex('liveness_configuration')
      .insert(records.map(toRow))
      .returning('id')

    return insertedRows.map((row) => row.id)
  }

  async updateMany(records: LivenessConfigurationRecord[]): Promise<number[]> {
    const knex = await this.knex()

    const rows = records.map((r) => ({
      ...toRow(r),
      id: r.id,
      last_synced_timestamp: r.lastSyncedTimestamp?.toDate(),
    }))

    const ids = await knex('liveness_configuration')
      .insert(rows)
      .onConflict('id')
      .merge()
      .returning('id')

    return ids.map((id) => id.id)
  }

  async deleteAll() {
    const knex = await this.knex()
    return knex('liveness_configuration').delete()
  }
}

function toRecord(row: LivenessConfigurationRow): LivenessConfigurationRecord {
  return {
    id: row.id,
    projectId: ProjectId(row.project_id),
    type: LivenessType(row.type),
    identifier: LivenessConfigurationIdentifier.unsafe(row.identifier),
    params: row.params,
    fromTimestamp: UnixTime.fromDate(row.from_timestamp),
    toTimestamp: UnixTime.fromDate(row.to_timestamp),
    lastSyncedTimestamp: row.last_synced_timestamp
      ? UnixTime.fromDate(row.last_synced_timestamp)
      : undefined,
  }
}

function toRow(
  record: Omit<LivenessConfigurationRecord, 'id' | 'lastSyncedTimestamp'>,
): Omit<LivenessConfigurationRow, 'id' | 'last_synced_timestamp'> {
  return {
    project_id: record.projectId.toString(),
    type: record.type,
    identifier: record.identifier.toString(),
    params: record.params,
    from_timestamp: record.fromTimestamp.toDate(),
    to_timestamp: record.toTimestamp.toDate(),
  }
}
