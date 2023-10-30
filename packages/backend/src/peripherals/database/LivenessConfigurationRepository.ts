import { Logger } from '@l2beat/backend-tools'
import { LivenessType, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { LivenessConfigurationRow } from 'knex/types/tables'

import { BaseRepository, CheckConvention } from './shared/BaseRepository'
import { Database } from './shared/Database'

export interface LivenessConfigurationRecord {
  projectId: ProjectId
  type: LivenessType
  configHash: string
  configRaw: object
  fromTimestamp: UnixTime
  toTimestamp: UnixTime
  lastSyncedTimestamp: UnixTime
}

// TODO: add index when we will write controler
export class LivenessConfigurationRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<LivenessConfigurationRepository>>(this)
  }

  async getByConfigHash(
    config_hash: string,
  ): Promise<LivenessConfigurationRecord[]> {
    const knex = await this.knex()
    const rows = await knex('liveness_configuration').where({ config_hash })
    return rows.map(toRecord)
  }

  async getAll(): Promise<LivenessConfigurationRecord[]> {
    const knex = await this.knex()
    const rows = await knex('liveness_configuration')
    return rows.map(toRecord)
  }

  async addOrUpdateMany(
    records: Omit<LivenessConfigurationRecord, 'id'>[],
  ): Promise<number> {
    const knex = await this.knex()

    await knex('liveness_configuration')
      .insert(records.map(toRow))
      .onConflict('id')
      .merge()

    return records.length
  }
}

function toRecord(
  row: Omit<LivenessConfigurationRow, 'id'>,
): LivenessConfigurationRecord {
  return {
    projectId: ProjectId(row.project_id),
    type: LivenessType(row.type),
    configHash: row.config_hash,
    configRaw: row.config_raw,
    fromTimestamp: UnixTime.fromDate(row.from_timestamp),
    toTimestamp: UnixTime.fromDate(row.to_timestamp),
    lastSyncedTimestamp: UnixTime.fromDate(row.last_synced_timestamp),
  }
}

function toRow(
  record: LivenessConfigurationRecord,
): Omit<LivenessConfigurationRow, 'id'> {
  return {
    project_id: record.projectId.toString(),
    type: record.type,
    config_hash: record.configHash,
    config_raw: record.configRaw,
    from_timestamp: record.fromTimestamp.toDate(),
    to_timestamp: record.toTimestamp.toDate(),
    last_synced_timestamp: record.lastSyncedTimestamp.toDate(),
  }
}
