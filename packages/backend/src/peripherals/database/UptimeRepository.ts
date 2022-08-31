import { Logger } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'
import { UptimeRow } from 'knex/types/tables'

import { BaseRepository } from './shared/BaseRepository'
import { Database } from './shared/Database'

export interface UptimeRecord {
  timestamp: UnixTime
  projectId: ProjectId
  strategyId: string // TODO: StrategyId
  active: boolean
  latency?: number
  error?: string
}

export class UptimeRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)

    /* eslint-disable @typescript-eslint/unbound-method */

    this.addMany = this.wrapAdd(this.addMany)
    this.getAll = this.wrapGet(this.getAll)
    this.deleteAll = this.wrapDelete(this.deleteAll)

    /* eslint-enable @typescript-eslint/unbound-method */
  }

  async addMany(records: UptimeRecord[]) {
    const rows = records.map(toRow)
    const knex = await this.knex()
    await knex('uptime').insert(rows)

    return rows.length
  }

  async getAll(): Promise<UptimeRecord[]> {
    const knex = await this.knex()
    const rows = await knex('uptime').select()
    return rows.map(toRecord)
  }

  async deleteAll() {
    const knex = await this.knex()
    return await knex('uptime').delete()
  }
}

function toRow(record: UptimeRecord): UptimeRow {
  return {
    unix_timestamp: record.timestamp.toString(),
    project_id: record.projectId.toString(),
    strategy_id: record.strategyId,
    active: record.active,
    latency: record.latency ?? null,
    error: record.error ?? null,
  }
}

function toRecord(row: UptimeRow): UptimeRecord {
  return {
    timestamp: new UnixTime(+row.unix_timestamp),
    projectId: ProjectId(row.project_id),
    strategyId: row.strategy_id,
    active: row.active,
    latency: row.latency ?? undefined,
    error: row.error ?? undefined,
  }
}
