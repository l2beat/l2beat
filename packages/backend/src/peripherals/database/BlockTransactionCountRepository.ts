import { Logger } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'
import { BlockTransactionCountRow } from 'knex/types/tables'

import { assert } from '../../tools/assert'
import { BlockTipRepository } from './BlockTipRepository'
import { BaseRepository } from './shared/BaseRepository'
import { Database } from './shared/Database'
import {
  Boundaries,
  extractTipNumber,
  Gap,
  toExpandedGaps,
} from './transactionCountTip'

export interface BlockTransactionCountRecord {
  timestamp: UnixTime
  projectId: ProjectId
  blockNumber: number
  count: number
}

export class BlockTransactionCountRepository extends BaseRepository {
  constructor(
    database: Database,
    logger: Logger,
    private readonly tipRepository: BlockTipRepository,
  ) {
    super(database, logger)
    /* eslint-disable @typescript-eslint/unbound-method */
    this.add = this.wrapAdd(this.add)
    this.addMany = this.wrapAddMany(this.addMany)
    this.deleteAll = this.wrapDelete(this.deleteAll)
    this.getDailyCountsByProject = this.wrapGet(this.getDailyCountsByProject)
    this.refreshDailyCounts = this.wrapAny(this.refreshDailyCounts)
    this.getGapsByProject = this.wrapGet(this.getGapsByProject)
    this.refreshProjectTip = this.wrapAny(this.refreshProjectTip)
    this.getGapsAndBoundaries = this.wrapAny(this.getGapsAndBoundaries)
    this.updateProjectTipByBlockNumber = this.wrapAny(
      this.updateProjectTipByBlockNumber,
    )
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

  async getDailyCountsByProject(
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
    await knex.schema.refreshMaterializedView(
      'transactions.block_count_view',
      true,
    )
  }

  async getGapsByProject(
    projectId: ProjectId,
    first: number,
    last: number,
  ): Promise<[number, number][]> {
    const { boundaries, gaps } = await this.refreshProjectTip(projectId)
    return toExpandedGaps(first, last, gaps, boundaries)
  }

  private async refreshProjectTip(projectId: ProjectId) {
    const { boundaries, gaps } = await this.getGapsAndBoundaries(projectId)
    const tipBlockNumber = extractTipNumber(gaps, boundaries)
    await this.updateProjectTipByBlockNumber(projectId, tipBlockNumber)
    return { boundaries, gaps }
  }

  private async getGapsAndBoundaries(projectId: ProjectId): Promise<{
    gaps: Gap[]
    boundaries?: Boundaries
  }> {
    const knex = await this.knex()
    const tip = await this.tipRepository.findByProject(projectId)
    const { rows } = (await knex.raw(
      `
      SELECT NULL AS prev, min(block_number) AS next FROM transactions.block WHERE project_id = :projectId
      UNION
      SELECT block_number AS prev, next
      FROM (
        SELECT
          block_number,
          lead(block_number) over (order by block_number) AS next
        FROM transactions.block WHERE block_number >= :blockNumber AND project_id = :projectId
      ) with_lead
      WHERE next > block_number + 1 OR next IS NULL
      ORDER BY next ASC`,
      {
        blockNumber: tip?.blockNumber ?? 0,
        projectId: projectId.toString(),
      },
    )) as unknown as { rows: { prev: number | null; next: number | null }[] }

    const min = rows.splice(0, 1)[0]?.next
    const max = rows.splice(-1, 1)[0]?.prev

    return {
      gaps: rows.map(({ prev, next }) => {
        assert(prev !== null && next !== null)
        return [prev + 1, next - 1]
      }),
      boundaries: min !== null && max !== null ? { min, max } : undefined,
    }
  }

  private async updateProjectTipByBlockNumber(
    projectId: ProjectId,
    blockNumber?: number,
  ) {
    const knex = await this.knex()
    const block =
      blockNumber !== undefined
        ? await knex('transactions.block')
            .where('project_id', projectId.toString())
            .andWhere('block_number', blockNumber)
            .first()
        : undefined
    await this.tipRepository.updateByProject(
      projectId,
      block ? toRecord(block) : undefined,
    )
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
