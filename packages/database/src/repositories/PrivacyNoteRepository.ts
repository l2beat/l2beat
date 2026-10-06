import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { PrivacyNote } from '../kysely/generated/types'

export interface PrivacyNoteRecord {
  configurationId: string
  projectId: string
  noteId: number
  timestamp: UnixTime
  txHash: string
  amount: bigint
  expiresAt: UnixTime
}

function toRecord(row: Selectable<PrivacyNote>): PrivacyNoteRecord {
  return {
    ...row,
    noteId: Number(row.noteId),
    timestamp: UnixTime.fromDate(row.timestamp),
    amount: BigInt(row.amount),
    expiresAt: UnixTime.fromDate(row.expiresAt),
  }
}

function toRow(record: PrivacyNoteRecord): Insertable<PrivacyNote> {
  return {
    ...record,
    noteId: record.noteId.toString(),
    timestamp: UnixTime.toDate(record.timestamp),
    amount: record.amount.toString(),
    expiresAt: UnixTime.toDate(record.expiresAt),
  }
}

export class PrivacyNoteRepository extends BaseRepository {
  async upsertMany(records: PrivacyNoteRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 2_000, async (batch) => {
      await this.db
        .insertInto('PrivacyNote')
        .values(batch)
        .onConflict((oc) =>
          oc.columns(['configurationId', 'noteId']).doUpdateSet((eb) => ({
            projectId: eb.ref('excluded.projectId'),
            timestamp: eb.ref('excluded.timestamp'),
            txHash: eb.ref('excluded.txHash'),
            amount: eb.ref('excluded.amount'),
            expiresAt: eb.ref('excluded.expiresAt'),
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
  ): Promise<PrivacyNoteRecord[]> {
    if (projectIds.length === 0) return []

    const rows = await this.db
      .selectFrom('PrivacyNote')
      .selectAll()
      .where('projectId', 'in', projectIds)
      .where('timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('timestamp', '<', UnixTime.toDate(toExclusive))
      .orderBy('timestamp', 'asc')
      .orderBy('noteId', 'asc')
      .execute()
    return rows.map(toRecord)
  }

  async deleteByConfigInTimeRange(
    configurationId: string,
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('PrivacyNote')
      .where('configurationId', '=', configurationId)
      .where('timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('timestamp', '<=', UnixTime.toDate(toInclusive))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteByConfigIds(configurationIds: string[]): Promise<number> {
    if (configurationIds.length === 0) return 0

    const result = await this.db
      .deleteFrom('PrivacyNote')
      .where('configurationId', 'in', configurationIds)
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getAll(): Promise<PrivacyNoteRecord[]> {
    const rows = await this.db.selectFrom('PrivacyNote').selectAll().execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('PrivacyNote').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
