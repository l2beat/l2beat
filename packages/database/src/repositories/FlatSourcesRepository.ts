import { Hash256, UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { FlatSources } from '../kysely/generated/types'

export interface FlatSourcesRecord {
  projectId: string
  timestamp: number
  contentHash: Hash256
  flat: Record<string, string>
}

export function toRow(
  record: Omit<FlatSourcesRecord, 'flat'>,
  flat?: FlatSourcesRecord['flat'],
): Insertable<FlatSources> {
  const result = {
    projectId: record.projectId,
    timestamp: UnixTime.toDate(record.timestamp),
    contentHash: record.contentHash.toString(),
  }
  return flat === undefined ? result : { ...result, flat }
}

export function toRecord(row: Selectable<FlatSources>): FlatSourcesRecord {
  return {
    projectId: row.projectId,
    timestamp: UnixTime.fromDate(row.timestamp),
    contentHash: Hash256(row.contentHash),
    flat: row.flat as Record<string, string>,
  }
}

export class FlatSourcesRepository extends BaseRepository {
  async upsert(record: FlatSourcesRecord): Promise<void> {
    const { projectId, timestamp, contentHash, flat } = record

    await this.transaction(async () => {
      const existing = await this.db
        .selectFrom('FlatSources')
        .select(['contentHash']) // <-- don't download flat sources
        .where('projectId', '=', projectId)
        .forUpdate() // <-- lock the row for upcoming update
        .executeTakeFirst()

      if (existing) {
        const hashChanged = Hash256(existing.contentHash) !== contentHash
        const update = toRow(
          { projectId, timestamp, contentHash },
          hashChanged ? flat : undefined,
        )
        await this.db
          .updateTable('FlatSources')
          .set(update)
          .where('projectId', '=', projectId)
          .execute()
      } else {
        await this.db
          .insertInto('FlatSources')
          .values(toRow({ projectId, timestamp, contentHash }, flat))
          .execute()
      }
    })
  }

  async getAll(): Promise<FlatSourcesRecord[]> {
    const rows = await this.db.selectFrom('FlatSources').selectAll().execute()

    return rows.map(toRecord)
  }

  async get(projectId: string): Promise<FlatSourcesRecord | undefined> {
    const row = await this.db
      .selectFrom('FlatSources')
      .selectAll()
      .where('projectId', '=', projectId)
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('FlatSources').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
