import type { Insertable, Selectable, Updateable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { InteropPluginSyncState } from '../kysely/generated/types'

export interface InteropPluginSyncStateRecord {
  pluginName: string
  chain: string
  lastError: string | null
}

export type InteropPluginSyncStateUpdateable = Omit<
  Updateable<InteropPluginSyncStateRecord>,
  'pluginName' | 'chain'
>

export function toRecord(
  row: Selectable<InteropPluginSyncState>,
): InteropPluginSyncStateRecord {
  return row
}

export function toRow(
  record: InteropPluginSyncStateRecord,
): Insertable<InteropPluginSyncState> {
  return record
}

function toUpdateRow(
  record: InteropPluginSyncStateUpdateable,
): Updateable<InteropPluginSyncState> {
  return record
}

export class InteropPluginSyncStateRepository extends BaseRepository {
  async upsert(record: InteropPluginSyncStateRecord): Promise<void> {
    await this.db
      .insertInto('InteropPluginSyncState')
      .values(toRow(record))
      .onConflict((cb) =>
        cb.columns(['pluginName', 'chain']).doUpdateSet((eb) => ({
          lastError: eb.ref('excluded.lastError'),
        })),
      )
      .execute()
  }

  async updateByPluginNameAndChain(
    pluginName: string,
    chain: string,
    patch: InteropPluginSyncStateUpdateable,
  ): Promise<number> {
    const result = await this.db
      .updateTable('InteropPluginSyncState')
      .set(toUpdateRow(patch))
      .where('pluginName', '=', pluginName)
      .where('chain', '=', chain)
      .executeTakeFirst()

    return Number(result.numUpdatedRows)
  }

  async findByPluginNameAndChain(
    pluginName: string,
    chain: string,
  ): Promise<InteropPluginSyncStateRecord | undefined> {
    const row = await this.db
      .selectFrom('InteropPluginSyncState')
      .selectAll()
      .where('pluginName', '=', pluginName)
      .where('chain', '=', chain)
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async getAll(): Promise<InteropPluginSyncStateRecord[]> {
    const rows = await this.db
      .selectFrom('InteropPluginSyncState')
      .selectAll()
      .orderBy(['pluginName', 'chain'])
      .execute()

    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('InteropPluginSyncState')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
