import type { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable, Updateable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { InteropPluginStatus } from '../kysely/generated/types'
import { fromTimestamp, toTimestamp } from '../utils/timestamp'

export interface InteropPluginStatusRecord {
  pluginName: string
  resyncRequestedFrom: UnixTime | null
}

export type InteropPluginStatusUpdateable = Omit<
  Updateable<InteropPluginStatusRecord>,
  'pluginName'
>

export function toRecord(
  row: Selectable<InteropPluginStatus>,
): InteropPluginStatusRecord {
  return {
    ...row,
    resyncRequestedFrom: toTimestamp(row.resyncRequestedFrom),
  }
}

export function toRow(
  record: InteropPluginStatusRecord,
): Insertable<InteropPluginStatus> {
  return {
    ...record,
    resyncRequestedFrom: fromTimestamp(record.resyncRequestedFrom),
  }
}

function toUpdateRow(
  record: InteropPluginStatusUpdateable,
): Updateable<InteropPluginStatus> {
  return {
    ...record,
    resyncRequestedFrom: fromTimestamp(record.resyncRequestedFrom),
  }
}

export class InteropPluginStatusRepository extends BaseRepository {
  async insert(
    record: InteropPluginStatusRecord,
  ): Promise<InteropPluginStatusRecord> {
    const row = await this.db
      .insertInto('InteropPluginStatus')
      .values(toRow(record))
      .returningAll()
      .executeTakeFirstOrThrow()
    return toRecord(row)
  }

  async updateByPluginName(
    pluginName: string,
    patch: InteropPluginStatusUpdateable,
  ): Promise<number> {
    const result = await this.db
      .updateTable('InteropPluginStatus')
      .set(toUpdateRow(patch))
      .where('pluginName', '=', pluginName)
      .executeTakeFirst()

    return Number(result.numUpdatedRows)
  }

  async findByPluginName(
    pluginName: string,
  ): Promise<InteropPluginStatusRecord | undefined> {
    const row = await this.db
      .selectFrom('InteropPluginStatus')
      .selectAll()
      .where('pluginName', '=', pluginName)
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async getAll(): Promise<InteropPluginStatusRecord[]> {
    const rows = await this.db
      .selectFrom('InteropPluginStatus')
      .selectAll()
      .execute()

    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('InteropPluginStatus')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
