import { Logger } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'
import { BlockTransactionCountRow } from 'knex/types/tables'
import _ from 'lodash'

import { assert } from '../../tools/assert'
import { BaseRepository } from './shared/BaseRepository'
import { Database } from './shared/Database'

export interface BlockTransactionCountRecord {
  timestamp: UnixTime
  projectId: ProjectId
  blockNumber: number
  count: number
}
interface RawBlockNumberQueryResult {
  rows: {
    no_next_block_number: number | null
    no_prev_block_number: number | null
  }[]
}

export class BlockTransactionCountRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    /* eslint-disable @typescript-eslint/unbound-method */
    this.add = this.wrapAdd(this.add)
    this.addMany = this.wrapAddMany(this.addMany)
    this.deleteAll = this.wrapDelete(this.deleteAll)
    this.refreshProjectTip = this.wrapAny(this.refreshProjectTip)
    this.getMissingRangesByProject = this.wrapGet(
      this.getMissingRangesByProject,
    )
    this.refreshFullySyncedDailyCounts = this.wrapAny(
      this.refreshFullySyncedDailyCounts,
    )
    this.getFullySyncedDailyCounts = this.wrapGet(
      this.getFullySyncedDailyCounts,
    )
    this.findTipByProject = this.wrapFind(this.findTipByProject)
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

  async refreshProjectTip(projectId: ProjectId) {
    const knex = await this.knex()
    const currentTip = await this.findTipByProject(projectId)
    const tip = await this.findFreshTipByProject(
      projectId,
      currentTip?.block_number,
    )

    if (!tip) {
      await knex('transactions.block_tip')
        .delete()
        .where('project_id', projectId.toString())
      return undefined
    } else {
      await knex('transactions.block_tip')
        .insert({
          block_number: tip.blockNumber,
          unix_timestamp: tip.timestamp.toDate(),
          project_id: projectId.toString(),
        })
        .onConflict('project_id')
        .merge(['block_number', 'unix_timestamp'])
      return {
        projectId,
        blockNumber: tip.blockNumber,
        timestamp: tip.timestamp,
      }
    }
  }

  // Returns an array of half open intervals [) that include all missing block numbers
  async getMissingRangesByProject(projectId: ProjectId) {
    const knex = await this.knex()
    const tip = await this.findTipByProject(projectId)

    const blockNumbers = (await knex.raw(
      `
      WITH 
        project_blocks AS (
          SELECT * FROM transactions.block WHERE project_id = :projectId AND block_number >= :blockNumber
        ),
        no_next AS (
          SELECT 
            project_blocks.block_number
          FROM project_blocks 
          LEFT JOIN project_blocks b2 ON project_blocks.block_number  = b2.block_number - 1
          WHERE b2.block_number IS NULL
        ),
        no_prev AS (
          SELECT 
            project_blocks.block_number 
          FROM project_blocks 
          LEFT JOIN project_blocks b2 ON project_blocks.block_number = b2.block_number + 1
          WHERE b2.block_number IS NULL
        )
      SELECT no_prev.block_number as no_prev_block_number, NULL as no_next_block_number
      FROM no_prev 
      UNION
      SELECT NULL as no_prev_block_number, no_next.block_number as no_next_block_number
      FROM no_next
      ORDER BY no_prev_block_number, no_next_block_number ASC
      `,
      { projectId: projectId.toString(), blockNumber: tip?.block_number ?? 0 },
    )) as unknown as RawBlockNumberQueryResult

    const noPrevBlockNumbers = blockNumbers.rows.reduce<number[]>(
      (acc, row) => {
        if (row.no_prev_block_number !== null) {
          acc.push(row.no_prev_block_number)
        }
        return acc
      },
      [],
    )

    const noNextBlockNumbers = blockNumbers.rows.reduce<number[]>(
      (acc, row) => {
        if (row.no_next_block_number !== null) {
          acc.push(row.no_next_block_number + 1)
        }
        return acc
      },
      [],
    )

    noPrevBlockNumbers.push(Infinity)
    noNextBlockNumbers.unshift(-Infinity)

    assert(noNextBlockNumbers.length === noPrevBlockNumbers.length)

    return _.zip(noNextBlockNumbers, noPrevBlockNumbers) as [number, number][]
  }

  async refreshFullySyncedDailyCounts() {
    const knex = await this.knex()
    await knex.schema.refreshMaterializedView('transactions.block_count_view')
  }

  async getFullySyncedDailyCounts(
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

  async findTipByProject(projectId: ProjectId) {
    const knex = await this.knex()
    return knex('transactions.block_tip')
      .where('project_id', projectId.toString())
      .first()
  }

  async deleteAll() {
    const knex = await this.knex()
    await knex('transactions.block_tip').delete()
    return await knex('transactions.block').delete()
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
