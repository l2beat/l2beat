import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { PermissionResolution } from '../kysely/generated/types'

export interface PermissionResolutionRecord {
  id: number
  projectId: string
  timestamp: UnixTime
  resolutionBlob: unknown
}

export function toRow(
  record: Omit<PermissionResolutionRecord, 'id'>,
): Insertable<Omit<PermissionResolution, 'id'>> {
  return {
    projectId: record.projectId,
    timestamp: UnixTime.toDate(record.timestamp),
    resolutionBlob: JSON.stringify(record.resolutionBlob),
  }
}

export function toRecord(
  row: Selectable<PermissionResolution>,
): PermissionResolutionRecord {
  return {
    id: row.id,
    projectId: row.projectId,
    timestamp: UnixTime.fromDate(row.timestamp),
    resolutionBlob: row.resolutionBlob,
  }
}

export class PermissionResolutionRepository extends BaseRepository {
  async findLatest(
    projectId: string,
  ): Promise<PermissionResolutionRecord | undefined> {
    const row = await this.db
      .selectFrom('PermissionResolution')
      .selectAll()
      .where('projectId', '=', projectId)
      .orderBy('timestamp', 'desc')
      .limit(1)
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async insert(
    record: Omit<PermissionResolutionRecord, 'id'>,
  ): Promise<number> {
    const [id] = await this.insertMany([record])
    // biome-ignore lint/style/noNonNullAssertion: guaranteed by the query
    return id!
  }

  async insertMany(
    records: Omit<PermissionResolutionRecord, 'id'>[],
  ): Promise<number[]> {
    if (records.length === 0) return []

    const rows = records.map(toRow)
    const ids: number[] = []
    await this.batch(rows, 1_000, async (batch) => {
      const results = await this.db
        .insertInto('PermissionResolution')
        .values(batch)
        .returning('id')
        .execute()
      ids.push(...results.map((result) => result.id))
    })
    return ids
  }

  async getAll(): Promise<PermissionResolutionRecord[]> {
    const rows = await this.db
      .selectFrom('PermissionResolution')
      .selectAll()
      .execute()

    return rows.map(toRecord)
  }

  async getNewerThan(
    from: UnixTime,
    projectId: string,
  ): Promise<PermissionResolutionRecord[]> {
    const rows = await this.db
      .selectFrom('PermissionResolution')
      .selectAll()
      .where('timestamp', '>=', UnixTime.toDate(from))
      .where('projectId', '=', projectId)
      .orderBy('timestamp', 'desc')
      .execute()
    return rows.map(toRecord)
  }

  async deleteOlderThan(timestamp: UnixTime): Promise<number> {
    const result = await this.db
      .deleteFrom('PermissionResolution')
      .where('timestamp', '<', UnixTime.toDate(timestamp))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('PermissionResolution')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}