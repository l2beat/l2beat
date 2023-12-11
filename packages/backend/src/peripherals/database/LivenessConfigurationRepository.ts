import { Logger } from '@l2beat/backend-tools'
import { LivenessType, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { Knex } from 'knex'
import { LivenessConfigurationRow } from 'knex/types/tables'

import { LivenessConfigEntry } from '../../core/liveness/types/LivenessConfig'
import { LivenessId } from '../../core/liveness/types/LivenessId'
import { BaseRepository, CheckConvention } from './shared/BaseRepository'
import { Database } from './shared/Database'

export interface LivenessConfigurationRecord {
  id: LivenessId
  projectId: ProjectId
  type: LivenessType
  sinceTimestamp: UnixTime
  untilTimestamp?: UnixTime
  lastSyncedTimestamp?: UnixTime
  debugInfo: string
}

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
    records: LivenessConfigEntry[],
    trx?: Knex.Transaction,
  ): Promise<LivenessId[]> {
    const knex = await this.knex(trx)

    const insertedRows = await knex('liveness_configuration')
      .insert(records.map(toNewRow))
      .returning('id')

    return insertedRows.map((row) => LivenessId.unsafe(row.id))
  }

  async findUnusedConfigurationsIds(): Promise<LivenessId[]> {
    const knex = await this.knex()
    const rows = (await knex('liveness_configuration as c')
      .select('c.id')
      .leftJoin('liveness as l', 'c.id', 'l.liveness_id')
      .groupBy('c.id')
      .havingRaw('count(l.liveness_id) = 0')) as { id: string }[]

    return rows.map((row) => LivenessId.unsafe(row.id))
  }

  async setLastSyncedTimestamp(
    ids: LivenessId[],
    lastSyncedTimestamp: UnixTime,
    trx?: Knex.Transaction,
  ) {
    const knex = await this.knex(trx)

    return await knex('liveness_configuration')
      .whereIn('id', ids)
      .update({ last_synced_timestamp: lastSyncedTimestamp.toDate() })
  }

  async setUntilTimestamp(
    id: LivenessId,
    untilTimestamp: UnixTime,
    trx?: Knex.Transaction,
  ) {
    const knex = await this.knex(trx)

    return await knex('liveness_configuration')
      .where({ id: id.valueOf() })
      .update({ until_timestamp: untilTimestamp.toDate() })
  }

  async deleteAll() {
    const knex = await this.knex()
    return knex('liveness_configuration').delete()
  }

  async deleteMany(ids: LivenessId[], trx?: Knex.Transaction) {
    const knex = await this.knex(trx)
    return knex('liveness_configuration')
      .whereIn(
        'id',
        ids.map((id) => id.valueOf()),
      )
      .delete()
  }
}

function toRecord(row: LivenessConfigurationRow): LivenessConfigurationRecord {
  const untilTimestamp = row.until_timestamp
    ? UnixTime.fromDate(row.until_timestamp)
    : undefined

  const lastSyncedTimestamp = row.last_synced_timestamp
    ? UnixTime.fromDate(row.last_synced_timestamp)
    : undefined

  return {
    id: LivenessId.unsafe(row.id),
    projectId: ProjectId(row.project_id),
    type: LivenessType(row.type),
    sinceTimestamp: UnixTime.fromDate(row.since_timestamp),
    untilTimestamp,
    lastSyncedTimestamp,
    debugInfo: row.debug_info,
  }
}

function toNewRow(entry: LivenessConfigEntry): LivenessConfigurationRow {
  return {
    id: entry.id.valueOf(),
    project_id: entry.projectId.toString(),
    type: entry.type,
    since_timestamp: entry.sinceTimestamp.toDate(),
    until_timestamp: entry.untilTimestamp?.toDate() ?? null,
    last_synced_timestamp: null,
    debug_info: toDebugInfo(entry),
  }
}

function toDebugInfo(value: LivenessConfigEntry): string {
  if (value.formula === 'transfer') {
    return `Transfer: ${value.from.toString()} -> ${value.to.toString()}`
  } else {
    return `Function call: ${value.address.toString()} : ${value.selector.toString()}`
  }
}
