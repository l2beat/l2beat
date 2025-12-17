import type { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable, Updateable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { InteropPluginConfig } from '../kysely/generated/types'
import { fromTimestamp, toTimestamp } from '../utils/timestamp'

export type InteropPluginSyncedBlockRanges = Record<
  string, // chain
  {
    syncedFrom: number
    syncedTo: number
    lastOpError?: string
  }
>

export interface InteropPluginConfigRecord {
  pluginName: string
  syncedBlockRanges: InteropPluginSyncedBlockRanges | null
  resyncRequestedFrom: UnixTime | null
}

export type InteropPluginConfigUpdateable = Omit<
  Updateable<InteropPluginConfigRecord>,
  'pluginName'
>

export function toRecord(
  row: Selectable<InteropPluginConfig>,
): InteropPluginConfigRecord {
  return {
    pluginName: row.pluginName,
    syncedBlockRanges:
      row.syncedBlockRanges as InteropPluginSyncedBlockRanges | null,
    resyncRequestedFrom: toTimestamp(row.resyncRequestedFrom),
  }
}

export function toRow(
  record: InteropPluginConfigRecord,
): Insertable<InteropPluginConfig> {
  return {
    pluginName: record.pluginName,
    syncedBlockRanges: record.syncedBlockRanges,
    resyncRequestedFrom: fromTimestamp(record.resyncRequestedFrom),
  }
}

function toUpdateRow(
  record: InteropPluginConfigUpdateable,
): Updateable<InteropPluginConfig> {
  return {
    syncedBlockRanges: record.syncedBlockRanges,
    resyncRequestedFrom: fromTimestamp(record.resyncRequestedFrom),
  }
}

export class InteropPluginConfigRepository extends BaseRepository {
  async insert(record: InteropPluginConfigRecord): Promise<void> {
    await this.db
      .insertInto('InteropPluginConfig')
      .values(toRow(record))
      .execute()
  }

  async updateByPluginName(
    pluginName: string,
    patch: InteropPluginConfigUpdateable,
  ): Promise<number> {
    const result = await this.db
      .updateTable('InteropPluginConfig')
      .set(toUpdateRow(patch))
      .where('pluginName', '=', pluginName)
      .executeTakeFirst()

    return Number(result.numUpdatedRows)
  }

  async findByPluginName(
    pluginName: string,
  ): Promise<InteropPluginConfigRecord | undefined> {
    const row = await this.db
      .selectFrom('InteropPluginConfig')
      .selectAll()
      .where('pluginName', '=', pluginName)
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async getAll(): Promise<InteropPluginConfigRecord[]> {
    const rows = await this.db
      .selectFrom('InteropPluginConfig')
      .selectAll()
      .execute()

    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('InteropPluginConfig')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
