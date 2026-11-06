import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { LiveActivityBlock } from '../kysely/generated/types'

export interface LiveActivityBlockRecord {
  projectId: ProjectId
  number: number
  hash: string
  parentHash: string
  timestamp: UnixTime
  count: number
  uopsCount: number | null
  gasUsed: number
}

function toRecord(row: Selectable<LiveActivityBlock>): LiveActivityBlockRecord {
  return {
    ...row,
    projectId: ProjectId(row.projectId),
    timestamp: UnixTime.fromDate(row.timestamp),
    gasUsed: Number(row.gasUsed),
  }
}

function toRow(record: LiveActivityBlockRecord): Insertable<LiveActivityBlock> {
  return {
    ...record,
    projectId: record.projectId.toString(),
    timestamp: UnixTime.toDate(record.timestamp),
    gasUsed: record.gasUsed.toString(),
  }
}

export class LiveActivityBlockRepository extends BaseRepository {
  async upsertMany(records: LiveActivityBlockRecord[]): Promise<number> {
    if (records.length === 0) return 0

    await this.batch(records.map(toRow), 5_000, async (batch) => {
      await this.db
        .insertInto('LiveActivityBlock')
        .values(batch)
        .onConflict((cb) =>
          cb.columns(['projectId', 'number']).doUpdateSet((eb) => ({
            hash: eb.ref('excluded.hash'),
            parentHash: eb.ref('excluded.parentHash'),
            timestamp: eb.ref('excluded.timestamp'),
            count: eb.ref('excluded.count'),
            uopsCount: eb.ref('excluded.uopsCount'),
            gasUsed: eb.ref('excluded.gasUsed'),
          })),
        )
        .execute()
    })
    return records.length
  }

  /** The project's newest blocks, oldest first */
  async getNewest(
    projectId: ProjectId,
    limit: number,
  ): Promise<LiveActivityBlockRecord[]> {
    const rows = await this.db
      .selectFrom('LiveActivityBlock')
      .selectAll()
      .where('projectId', '=', projectId.toString())
      .orderBy('number', 'desc')
      .limit(limit)
      .execute()
    return rows.map(toRecord).reverse()
  }

  /** Both ends included, oldest first */
  async getByProjectNumberRange(
    projectId: ProjectId,
    from: number,
    to: number,
  ): Promise<LiveActivityBlockRecord[]> {
    const rows = await this.db
      .selectFrom('LiveActivityBlock')
      .selectAll()
      .where('projectId', '=', projectId.toString())
      .where('number', '>=', from)
      .where('number', '<=', to)
      .orderBy('number')
      .execute()
    return rows.map(toRecord)
  }

  async deleteByProjectAfter(
    projectId: ProjectId,
    number: number,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('LiveActivityBlock')
      .where('projectId', '=', projectId.toString())
      .where('number', '>', number)
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteByProject(projectId: ProjectId): Promise<number> {
    const result = await this.db
      .deleteFrom('LiveActivityBlock')
      .where('projectId', '=', projectId.toString())
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteBefore(timestamp: UnixTime): Promise<number> {
    const result = await this.db
      .deleteFrom('LiveActivityBlock')
      .where('timestamp', '<', UnixTime.toDate(timestamp))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('LiveActivityBlock')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
