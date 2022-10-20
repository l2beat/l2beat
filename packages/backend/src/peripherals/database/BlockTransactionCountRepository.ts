import { Logger } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'
import { BlockTransactionCountRow } from 'knex/types/tables'

import { BaseRepository } from './shared/BaseRepository'
import { Database } from './shared/Database'

export interface BlockTransactionCountRecord {
  timestamp: UnixTime
  projectId: ProjectId
  blockNumber: number
  count: number
}

export class BlockTransactionCountRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    /* eslint-disable @typescript-eslint/unbound-method */
    this.add = this.wrapAdd(this.add)
    this.addMany = this.wrapAddMany(this.addMany)
    this.deleteAll = this.wrapDelete(this.deleteAll)
    this.findBoundariesByProject = this.wrapFind(this.findBoundariesByProject)
    this.getDailyCounts = this.wrapGet(this.getDailyCounts)
    this.refreshDailyCounts = this.wrapAny(this.refreshDailyCounts)
    this.getGapsByProject = this.wrapGet(this.getGapsByProject)
    this.findTipByProject = this.wrapFind(this.findTipByProject)
    this.refreshProjectTip = this.wrapAny(this.refreshProjectTip)
    this.findFreshTipByProject = this.wrapFind(this.findFreshTipByProject)
    /* eslint-enable @typescript-eslint/unbound-method */
  }

  async add(record: BlockTransactionCountRecord) {
    const knex = await this.knex()
    const row = toRow(record)
    await knex('transactions.block').insert(row)
    return `${row.project_id}-${row.block_number}`
  }

  async addMany(records: BlockTransactionCountRecord[]) {
    const knex = await this.knex()
    const rows = records.map(toRow)
    await knex('transactions.block').insert(rows)
    return rows.length
  }

  async deleteAll() {
    const knex = await this.knex()
    await knex('transactions.block_tip').delete()
    return await knex('transactions.block').delete()
  }

  async findBoundariesByProject(
    projectId: ProjectId,
  ): Promise<{ min: number; max: number } | undefined> {
    const knex = await this.knex()
    const row = (await knex('transactions.block')
      .min('block_number')
      .max('block_number')
      .where('project_id', projectId.toString())
      .first()) as { min: null | number; max: null | number }
    return row.min !== null && row.max !== null
      ? { min: row.min, max: row.max }
      : undefined
  }

  async getDailyCounts(
    projectId: ProjectId,
  ): Promise<{ timestamp: UnixTime; count: number }[]> {
    const knex = await this.knex()
    const rows = await knex('transactions.block_count_view')
      .where('project_id', projectId.toString())
      .orderBy('unix_timestamp')

    return rows.map((r) => ({
      timestamp: UnixTime.fromDate(r.unix_timestamp),
      count: Number(r.count),
    }))
  }

  async refreshDailyCounts(projectIds: ProjectId[]) {
    const knex = await this.knex()
    for (const projectId of projectIds) {
      await this.refreshProjectTip(projectId)
    }
    await knex.schema.refreshMaterializedView('transactions.block_count_view')
  }

  async getGapsByProject(projectId: ProjectId): Promise<[number, number][]> {
    const knex = await this.knex()
    const tip = await this.refreshProjectTip(projectId)
    const { rows } = (await knex.raw(
      `
      SELECT block_number + 1 start, next - 1 end
      FROM (
        SELECT
          block_number,
          lead(block_number) over (order by block_number) next
        FROM transactions.block where block_number >= :blockNumber AND project_id = :projectId
      ) with_lead
      WHERE next <> block_number + 1`,
      {
        projectId: projectId.toString(),
        blockNumber: tip?.blockNumber ?? 0,
      },
    )) as unknown as { rows: { start: number; end: number }[] }
    return rows.map(({ start, end }) => [start, end])
  }

  async findTipByProject(projectId: ProjectId) {
    const knex = await this.knex()
    const row = await knex('transactions.block_tip')
      .where('project_id', projectId.toString())
      .first()
    return row ? toRecord(row) : undefined
  }

  private async refreshProjectTip(projectId: ProjectId) {
    const knex = await this.knex()
    const currentTip = await this.findTipByProject(projectId)
    const freshTip = await this.findFreshTipByProject(
      projectId,
      currentTip?.blockNumber,
    )

    if (!freshTip) {
      await knex('transactions.block_tip')
        .delete()
        .where('project_id', projectId.toString())
      return undefined
    } else {
      await knex('transactions.block_tip')
        .insert(toRow(freshTip))
        .onConflict('project_id')
        .merge(['block_number', 'unix_timestamp'])
      return freshTip
    }
  }

  private async findFreshTipByProject(projectId: ProjectId, scanFrom = 0) {
    const knex = await this.knex()
    const blockNumberQuery = knex.raw(
      `
      SELECT min(block_number)
      FROM (
        SELECT
          block_number,
          lead(block_number) over (order by block_number) next
        FROM transactions.block where block_number >= :blockNumber AND project_id = :projectId
      ) with_lead
      WHERE next <> block_number + 1 OR next IS NULL`,
      {
        projectId: projectId.toString(),
        blockNumber: scanFrom,
      },
    )
    const row = await knex('transactions.block')
      .where('project_id', projectId.toString())
      .andWhere('block_number', blockNumberQuery.wrap('(', ')'))
      .first()

    return row ? toRecord(row) : undefined
  }
}

function toRow(record: BlockTransactionCountRecord): BlockTransactionCountRow {
  return {
    unix_timestamp: record.timestamp.toDate(),
    project_id: record.projectId.toString(),
    block_number: record.blockNumber,
    count: record.count,
  }
}

function toRecord(row: BlockTransactionCountRow): BlockTransactionCountRecord {
  return {
    timestamp: UnixTime.fromDate(row.unix_timestamp),
    projectId: ProjectId(row.project_id),
    blockNumber: row.block_number,
    count: row.count,
  }
}
