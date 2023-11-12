import { Logger } from '@l2beat/backend-tools'
import { LivenessType, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { Knex } from 'knex'
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
  sinceTimestamp: UnixTime
  untilTimestamp?: UnixTime
  lastSyncedTimestamp?: UnixTime
}

export type NewLivenessConfigurationRecord = Omit<
  LivenessConfigurationRecord,
  'id' | 'lastSyncedTimestamp'
>

// TODO: add index when we will write controller
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
    records: NewLivenessConfigurationRecord[],
    trx?: Knex.Transaction,
  ): Promise<number[]> {
    const knex = await this.knex(trx)

    const insertedRows = await knex('liveness_configuration')
      .insert(records.map(toRow))
      .returning('id')

    return insertedRows.map((row) => row.id)
  }

  async updateMany(
    records: LivenessConfigurationRecord[],
    trx?: Knex.Transaction,
  ): Promise<number[]> {
    const knex = await this.knex(trx)

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

  async deleteMany(ids: number[], trx?: Knex.Transaction) {
    const knex = await this.knex(trx)
    return knex('liveness_configuration').whereIn('id', ids).delete()
  }
}

function toRecord(row: LivenessConfigurationRow): LivenessConfigurationRecord {
  return {
    id: row.id,
    projectId: ProjectId(row.project_id),
    type: LivenessType(row.type),
    identifier: LivenessConfigurationIdentifier.unsafe(row.identifier),
    params: row.params,
    sinceTimestamp: UnixTime.fromDate(row.since_timestamp),
    untilTimestamp: row.until_timestamp
      ? UnixTime.fromDate(row.until_timestamp)
      : undefined,
    lastSyncedTimestamp: row.last_synced_timestamp
      ? UnixTime.fromDate(row.last_synced_timestamp)
      : undefined,
  }
}

function toRow(
  record: NewLivenessConfigurationRecord,
): Omit<LivenessConfigurationRow, 'id' | 'last_synced_timestamp'> {
  return {
    project_id: record.projectId.toString(),
    type: record.type,
    identifier: record.identifier.toString(),
    params: record.params,
    since_timestamp: record.sinceTimestamp.toDate(),
    until_timestamp: record.untilTimestamp
      ? record.untilTimestamp.toDate()
      : undefined,
  }
}
