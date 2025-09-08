import type { DiscoveryDiff } from '@l2beat/discovery'
import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { UpdateNotifier } from '../kysely/generated/types'

export interface UpdateNotifierRecord {
  id: number
  createdAt: UnixTime
  updatedAt: UnixTime
  projectId: string
  timestamp: UnixTime
  diff: DiscoveryDiff[]
}

export function toRow(
  record: Omit<UpdateNotifierRecord, 'id' | 'createdAt' | 'updatedAt'>,
): Insertable<Omit<UpdateNotifier, 'id' | 'created_at' | 'updated_at'>> {
  return {
    projectId: record.projectId,
    timestamp: UnixTime.toDate(record.timestamp),
    diffJsonBlob: JSON.stringify(record.diff),
  }
}

export function toRecord(
  row: Selectable<UpdateNotifier>,
): UpdateNotifierRecord {
  return {
    id: row.id,
    createdAt: UnixTime.fromDate(row.createdAt),
    updatedAt: UnixTime.fromDate(row.updatedAt),
    projectId: row.projectId,
    timestamp: UnixTime.fromDate(row.timestamp),
    diff: row.diffJsonBlob as unknown as DiscoveryDiff[],
  }
}

export class UpdateNotifierRepository extends BaseRepository {
  async findLatestId(): Promise<number | undefined> {
    const row = await this.db
      .selectFrom('UpdateNotifier')
      .select(['id'])
      .orderBy('id', 'desc')
      .limit(1)
      .executeTakeFirst()
    return row?.id
  }

  async insert(
    record: Omit<UpdateNotifierRecord, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<number> {
    const [id] = await this.insertMany([record])
    // biome-ignore lint/style/noNonNullAssertion: guaranteed by the query
    return id!
  }

  async insertMany(
    records: Omit<UpdateNotifierRecord, 'id' | 'createdAt' | 'updatedAt'>[],
  ): Promise<number[]> {
    if (records.length === 0) return []

    const rows = records.map(toRow)
    const ids: number[] = []
    await this.batch(rows, 1_000, async (batch) => {
      const results = await this.db
        .insertInto('UpdateNotifier')
        .values(batch)
        .returning('id')
        .execute()
      ids.push(...results.map((result) => result.id))
    })
    return ids
  }

  async getAll(): Promise<UpdateNotifierRecord[]> {
    const rows = await this.db
      .selectFrom('UpdateNotifier')
      .selectAll()
      .execute()

    return rows.map(toRecord)
  }

  async getNewerThan(
    from: UnixTime,
    projectId: string,
  ): Promise<UpdateNotifierRecord[]> {
    const rows = await this.db
      .selectFrom('UpdateNotifier')
      .selectAll()
      .where('createdAt', '>=', UnixTime.toDate(from))
      .where('projectId', '=', projectId)
      .execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('UpdateNotifier').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
