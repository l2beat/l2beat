import { Logger } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'
import {
  BlockTransactionCountRow,
  TransactionCountBlockTipRow,
} from 'knex/types/tables'
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
    this.getMissingRangesByProject = this.wrapAny(
      this.getMissingRangesByProject,
    )
    this.refreshDailyTransactionCount = this.wrapAny(
      this.refreshDailyTransactionCount,
    )
    this.getDailyTransactionCount = this.wrapGet(this.getDailyTransactionCount)
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
    const currentTip = await this.getTipByProject(projectId)
    const tipNumber =
      (await this.getFirstBlockNumberWithoutNext(
        projectId,
        currentTip?.block_number,
      )) ?? (await this.getMaxBlockNumber(projectId))

    if (!tipNumber) {
      await knex('transactions.block_tip')
        .delete()
        .where('project_id', projectId.toString())
      return undefined
    } else {
      const tip = await knex('transactions.block')
        .where('project_id', projectId.toString())
        .andWhere('block_number', tipNumber)
        .first()
      assert(tip, 'Calculated tip not found')
      await knex('transactions.block_tip')
        .insert({
          block_number: tipNumber,
          unix_timestamp: tip.unix_timestamp,
          project_id: projectId.toString(),
        })
        .onConflict('project_id')
        .merge(['block_number', 'unix_timestamp'])
      return {
        projectId,
        blockNumber: tip.block_number,
        timestamp: UnixTime.fromDate(tip.unix_timestamp),
      }
    }
  }

  // Returns an array of half open intervals [) that include all missing block numbers
  async getMissingRangesByProject(projectId: ProjectId) {
    const knex = await this.knex()
    const tip = await this.getTipByProject(projectId)

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

  async refreshDailyTransactionCount() {
    const knex = await this.knex()
    await knex.schema.refreshMaterializedView('transactions.block_count_view')
  }

  async getDailyTransactionCount(
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

  async getTipByProject(projectId: ProjectId) {
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

  private async getMaxBlockNumber(projectId: ProjectId) {
    const knex = await this.knex()
    const result = await knex('transactions.block')
      .max('block_number')
      .where('project_id', projectId.toString())
      .first()
    return result?.max
  }

  private async getFirstBlockNumberWithoutNext(
    projectId: ProjectId,
    scanFrom = 0,
  ) {
    const knex = await this.knex()
    const {
      rows: [noNext],
    } = (await knex.raw(
      `
      SELECT min(block_number) as block_number
      FROM (
        SELECT
          block_number,
          lead(block_number) over (order by block_number) as next
        FROM transactions.block where project_id = :projectId AND block_number >= :blockNumber
      ) with_lead
      WHERE next <> block_number + 1;
    `,
      {
        projectId: projectId.toString(),
        blockNumber: scanFrom,
      },
    )) as unknown as {
      rows: (Pick<TransactionCountBlockTipRow, 'block_number'> | undefined)[]
    }
    return noNext?.block_number
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
