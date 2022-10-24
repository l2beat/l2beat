import { Logger } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'
import { StarkexTransactionCountRow } from 'knex/types/tables'

import { assert } from '../../tools/assert'
import { BaseRepository } from './shared/BaseRepository'
import { Database } from './shared/Database'
import {
  Boundaries,
  extractTipNumber,
  Gap,
  toExpandedGaps,
} from './transactionCountTip'

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
    this.getDailyCountsByProject = this.wrapGet(this.getDailyCountsByProject)
    this.getGapsByProject = this.wrapGet(this.getGapsByProject)
    this.getGapsAndBoundariesByProject = this.wrapAny(
      this.getGapsAndBoundariesByProject,
    )
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

  async getDailyCountsByProject(
    projectId: ProjectId,
  ): Promise<{ timestamp: UnixTime; count: number }[]> {
    const { boundaries, gaps } = await this.getGapsAndBoundariesByProject(
      projectId,
    )
    const tipDay = extractTipNumber(gaps, boundaries)
    if (!tipDay) {
      return []
    }
    const knex = await this.knex()
    const rows = await knex('transactions.starkex')
      .where('project_id', projectId.toString())
      .andWhere('unix_timestamp', '<=', UnixTime.fromDays(tipDay).toDate())
      .orderBy('unix_timestamp')

    return rows
      .map(toRecord)
      .map(({ count, timestamp }) => ({ count, timestamp }))
  }

  async getGapsByProject(
    projectId: ProjectId,
    first: number,
    last: number,
  ): Promise<Gap[]> {
    const { boundaries, gaps } = await this.getGapsAndBoundariesByProject(
      projectId,
    )
    return toExpandedGaps(first, last, gaps, boundaries)
  }

  private async getGapsAndBoundariesByProject(projectId: ProjectId): Promise<{
    gaps: Gap[]
    boundaries?: Boundaries
  }> {
    const knex = await this.knex()
    const { rows } = (await knex.raw(
      `
      SELECT NULL prev, min(unix_timestamp) next FROM transactions.starkex WHERE project_id = :projectId
      UNION
      SELECT unix_timestamp prev, next
      FROM (
        SELECT
          unix_timestamp,
          lead(unix_timestamp) over (order by unix_timestamp) next
        FROM transactions.starkex where project_id = :projectId
      ) with_lead
      WHERE next > unix_timestamp + interval '24 hours' OR next IS NULL
      ORDER BY next ASC`,
      {
        projectId: projectId.toString(),
      },
    )) as unknown as { rows: { prev: Date | null; next: Date | null }[] }

    const minDate = rows.splice(0, 1)[0]?.next
    const maxDate = rows.splice(-1, 1)[0]?.prev

    return {
      gaps: rows.map(({ prev, next }) => {
        assert(prev !== null && next !== null)
        return [
          UnixTime.fromDate(prev).toDays() + 1,
          UnixTime.fromDate(next).toDays() - 1,
        ]
      }),
      boundaries:
        minDate !== null && maxDate !== null
          ? {
              min: UnixTime.fromDate(minDate).toDays(),
              max: UnixTime.fromDate(maxDate).toDays(),
            }
          : undefined,
    }
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
