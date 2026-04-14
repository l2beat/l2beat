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

  /**
   * Fetches a single UpdateNotifier row by id. Returns `null` if not found.
   * Used by the DeFiDisco monitor admin dashboard to avoid downloading the
   * full table for point lookups and mutations.
   */
  async getById(id: number): Promise<UpdateNotifierRecord | null> {
    const row = await this.db
      .selectFrom('UpdateNotifier')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst()
    return row ? toRecord(row) : null
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

  /**
   * Returns all rows for `projectId` with `id > afterId`, ordered by id ascending.
   * Used by the DeFiDisco activity reconciler to walk history in a
   * crash-safe way using the monotonic row id as the cursor.
   * Pass `0` for `afterId` to read the full history.
   */
  async getNewerThanId(
    projectId: string,
    afterId: number,
  ): Promise<UpdateNotifierRecord[]> {
    const rows = await this.db
      .selectFrom('UpdateNotifier')
      .selectAll()
      .where('projectId', '=', projectId)
      .where('id', '>', afterId)
      .orderBy('id', 'asc')
      .execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('UpdateNotifier').executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  /**
   * Deletes a single UpdateNotifier row by id. Used by the DeFiDisco
   * monitor admin dashboard to clean up noisy entries.
   */
  async deleteById(id: number): Promise<number> {
    const result = await this.db
      .deleteFrom('UpdateNotifier')
      .where('id', '=', id)
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  /**
   * Replaces the diff blob for a single UpdateNotifier row. Used by the
   * DeFiDisco monitor admin dashboard to surgically strip noisy fields
   * while keeping the row.
   */
  async updateDiff(id: number, diff: DiscoveryDiff[]): Promise<number> {
    const result = await this.db
      .updateTable('UpdateNotifier')
      .set({ diffJsonBlob: JSON.stringify(diff) })
      .where('id', '=', id)
      .executeTakeFirst()
    return Number(result.numUpdatedRows)
  }
}
