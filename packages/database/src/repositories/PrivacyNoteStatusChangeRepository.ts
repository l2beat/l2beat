import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { PrivacyNoteStatusChange } from '../kysely/generated/types'

export interface PrivacyNoteStatusChangeRecord {
  configurationId: string
  projectId: string
  noteId: number
  timestamp: UnixTime
  blockNumber: number
  txHash: string
  logIndex: number
  active: boolean
}

function toRecord(
  row: Selectable<PrivacyNoteStatusChange>,
): PrivacyNoteStatusChangeRecord {
  return {
    ...row,
    noteId: Number(row.noteId),
    timestamp: UnixTime.fromDate(row.timestamp),
  }
}

function toRow(
  record: PrivacyNoteStatusChangeRecord,
): Insertable<PrivacyNoteStatusChange> {
  return {
    ...record,
    noteId: record.noteId.toString(),
    timestamp: UnixTime.toDate(record.timestamp),
  }
}

export class PrivacyNoteStatusChangeRepository extends BaseRepository {
  async upsertMany(records: PrivacyNoteStatusChangeRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 2_000, async (batch) => {
      await this.db
        .insertInto('PrivacyNoteStatusChange')
        .values(batch)
        .onConflict((oc) =>
          oc
            .columns(['configurationId', 'txHash', 'logIndex'])
            .doUpdateSet((eb) => ({
              projectId: eb.ref('excluded.projectId'),
              noteId: eb.ref('excluded.noteId'),
              timestamp: eb.ref('excluded.timestamp'),
              blockNumber: eb.ref('excluded.blockNumber'),
              active: eb.ref('excluded.active'),
            })),
        )
        .execute()
    })

    return rows.length
  }

  async getByProjectIds(
    projectIds: string[],
    fromInclusive: UnixTime,
    toExclusive: UnixTime,
  ): Promise<PrivacyNoteStatusChangeRecord[]> {
    if (projectIds.length === 0) return []

    const rows = await this.db
      .selectFrom('PrivacyNoteStatusChange')
      .selectAll()
      .where('projectId', 'in', projectIds)
      .where('timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('timestamp', '<', UnixTime.toDate(toExclusive))
      .orderBy('blockNumber', 'asc')
      .orderBy('logIndex', 'asc')
      .execute()
    return rows.map(toRecord)
  }

  async deleteByConfigInTimeRange(
    configurationId: string,
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('PrivacyNoteStatusChange')
      .where('configurationId', '=', configurationId)
      .where('timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('timestamp', '<=', UnixTime.toDate(toInclusive))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteByConfigIds(configurationIds: string[]): Promise<number> {
    if (configurationIds.length === 0) return 0

    const result = await this.db
      .deleteFrom('PrivacyNoteStatusChange')
      .where('configurationId', 'in', configurationIds)
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getAll(): Promise<PrivacyNoteStatusChangeRecord[]> {
    const rows = await this.db
      .selectFrom('PrivacyNoteStatusChange')
      .selectAll()
      .execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('PrivacyNoteStatusChange')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
