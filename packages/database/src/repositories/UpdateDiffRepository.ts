import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { UpdateDiff } from '../kysely/generated/types'

type UpdateDiffType =
  | 'ultimateUpgraderChange'
  | 'implementationChange'
  | 'highSeverityFieldChange'
  | 'becameVerified'

export interface UpdateDiffRecord {
  type: UpdateDiffType
  address: string
  projectId: string
  timestamp: UnixTime
  diffBaseTimestamp: number
  diffHeadTimestamp: number
}

export function toRow(record: UpdateDiffRecord): Insertable<UpdateDiff> {
  return {
    projectId: record.projectId,
    address: record.address,
    type: record.type,
    timestamp: UnixTime.toDate(record.timestamp),
    diffBaseTimestamp: UnixTime.toDate(record.diffBaseTimestamp),
    diffHeadTimestamp: UnixTime.toDate(record.diffHeadTimestamp),
  }
}

export function toRecord(row: Selectable<UpdateDiff>): UpdateDiffRecord {
  return {
    projectId: row.projectId,
    address: row.address,
    type: row.type as UpdateDiffType,
    timestamp: UnixTime.fromDate(row.timestamp),
    diffBaseTimestamp: UnixTime.fromDate(row.diffBaseTimestamp),
    diffHeadTimestamp: UnixTime.fromDate(row.diffHeadTimestamp),
  }
}

export class UpdateDiffRepository extends BaseRepository {
  async insertMany(records: UpdateDiffRecord[]): Promise<number> {
    if (records.length === 0) return 0

    await this.db
      .insertInto('UpdateDiff')
      .values(records.map(toRow))
      .onConflict((cb) =>
        cb.columns(['projectId', 'address', 'type']).doNothing(),
      )
      .execute()

    return records.length
  }

  async getAll() {
    const rows = await this.db.selectFrom('UpdateDiff').selectAll().execute()
    return rows.map(toRecord)
  }

  async deleteByProjectAndChain(projectId: string) {
    await this.db
      .deleteFrom('UpdateDiff')
      .where('projectId', '=', projectId)
      .execute()
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('UpdateDiff').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
