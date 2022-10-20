import { Logger } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'
import { StarkexTransactionCountRow } from 'knex/types/tables'

import { BaseRepository } from './shared/BaseRepository'
import { Database } from './shared/Database'

export interface StarkexTransactionCountRecord {
  timestamp: UnixTime
  projectId: ProjectId
  count: number
}

export class StarkexTransactionCountRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    /* eslint-disable @typescript-eslint/unbound-method */
    this.add = this.wrapAdd(this.add)
    this.addMany = this.wrapAddMany(this.addMany)
    this.deleteAll = this.wrapDelete(this.deleteAll)
    this.findBoundariesByProject = this.wrapFind(this.findBoundariesByProject)
    this.getDailyCountsByProject = this.wrapGet(this.getDailyCountsByProject)
    this.getGapsByProject = this.wrapGet(this.getGapsByProject)
    this.findTipByProject = this.wrapFind(this.findTipByProject)
    /* eslint-enable @typescript-eslint/unbound-method */
  }

  async add(record: StarkexTransactionCountRecord) {
    const knex = await this.knex()
    const row = toRow(record)
    await knex('transactions.starkex').insert(row)
    return `${row.project_id}-${row.unix_timestamp.toDateString()}`
  }

  async addMany(records: StarkexTransactionCountRecord[]) {
    const knex = await this.knex()
    const rows = records.map(toRow)
    await knex('transactions.starkex').insert(rows)
    return rows.length
  }

  async deleteAll() {
    const knex = await this.knex()
    return await knex('transactions.starkex').delete()
  }

  async findBoundariesByProject(
    projectId: ProjectId,
  ): Promise<{ min: number; max: number } | undefined> {
    const knex = await this.knex()
    const row = (await knex('transactions.starkex')
      .min('unix_timestamp')
      .max('unix_timestamp')
      .where('project_id', projectId.toString())
      .first()) as { min: null | Date; max: null | Date }

    return row.min !== null && row.max !== null
      ? {
          min: UnixTime.fromDate(row.min).toDays(),
          max: UnixTime.fromDate(row.max).toDays(),
        }
      : undefined
  }

  async getDailyCountsByProject(
    projectId: ProjectId,
  ): Promise<{ timestamp: UnixTime; count: number }[]> {
    const knex = await this.knex()
    const tip = await this.findTipByProject(projectId)
    if (!tip) {
      return []
    }
    const rows = await knex('transactions.starkex')
      .where('project_id', projectId.toString())
      .andWhere('unix_timestamp', '<=', tip.timestamp.toDate())
      .orderBy('unix_timestamp')

    return rows
      .map(toRecord)
      .map(({ count, timestamp }) => ({ count, timestamp }))
  }

  async getGapsByProject(projectId: ProjectId): Promise<[number, number][]> {
    const knex = await this.knex()
    const { rows } = (await knex.raw(
      `
      SELECT unix_timestamp + interval '24 hours' start, next - interval '24 hours' end
      FROM (
        SELECT
          unix_timestamp,
          lead(unix_timestamp) over (order by unix_timestamp) next
        FROM transactions.starkex where project_id = :projectId
      ) with_lead
      WHERE next <> unix_timestamp + interval '24 hours'`,
      {
        projectId: projectId.toString(),
      },
    )) as unknown as { rows: { start: Date; end: Date }[] }

    return rows.map(({ start, end }) => [
      UnixTime.fromDate(start).toDays(),
      UnixTime.fromDate(end).toDays(),
    ])
  }

  async findTipByProject(projectId: ProjectId) {
    const knex = await this.knex()
    const timestampQuery = knex.raw(
      `
      SELECT min(unix_timestamp)
      FROM (
        SELECT
          unix_timestamp,
          lead(unix_timestamp) over (order by unix_timestamp) next
        FROM transactions.starkex where project_id = :projectId
      ) with_lead
      WHERE next <> unix_timestamp + interval '24 hours' OR next IS NULL`,
      {
        projectId: projectId.toString(),
      },
    )
    const row = await knex('transactions.starkex')
      .where('project_id', projectId.toString())
      .andWhere('unix_timestamp', timestampQuery.wrap('(', ')'))
      .first()

    return row ? toRecord(row) : undefined
  }
}

function toRow(
  record: StarkexTransactionCountRecord,
): StarkexTransactionCountRow {
  return {
    unix_timestamp: record.timestamp.toDate(),
    project_id: record.projectId.toString(),
    count: record.count,
  }
}

function toRecord(
  row: StarkexTransactionCountRow,
): StarkexTransactionCountRecord {
  return {
    projectId: ProjectId(row.project_id),
    timestamp: UnixTime.fromDate(row.unix_timestamp),
    count: row.count,
  }
}
