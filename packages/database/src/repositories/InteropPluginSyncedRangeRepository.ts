import type { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable, Updateable } from 'kysely'
import isNil from 'lodash/isNil'
import { BaseRepository } from '../BaseRepository'
import type { InteropPluginSyncedRange } from '../kysely/generated/types'
import { fromTimestamp, toTimestamp } from '../utils/timestamp'

export interface BlockRangeWithTimestamps {
  fromBlock: bigint
  fromTimestamp: UnixTime
  toBlock: bigint
  toTimestamp: UnixTime
}

export type InteropPluginSyncedRangeRecord = {
  pluginName: string
  chain: string
} & BlockRangeWithTimestamps

export type InteropPluginSyncedRangeUpdateable = Omit<
  Updateable<InteropPluginSyncedRangeRecord>,
  'pluginName' | 'chain'
>

export function toRecord(
  row: Selectable<InteropPluginSyncedRange>,
): InteropPluginSyncedRangeRecord {
  return {
    ...row,
    fromBlock: BigInt(row.fromBlock),
    toBlock: BigInt(row.toBlock),
    fromTimestamp: toTimestamp(row.fromTimestamp),
    toTimestamp: toTimestamp(row.toTimestamp),
  }
}

export function toRow(
  record: InteropPluginSyncedRangeRecord,
): Insertable<InteropPluginSyncedRange> {
  return {
    ...record,
    fromBlock: record.fromBlock.toString(),
    toBlock: record.toBlock.toString(),
    fromTimestamp: fromTimestamp(record.fromTimestamp),
    toTimestamp: fromTimestamp(record.toTimestamp),
  }
}

function toUpdateRow(
  record: InteropPluginSyncedRangeUpdateable,
): Updateable<InteropPluginSyncedRange> {
  return {
    ...record,
    fromBlock: isNil(record.fromBlock)
      ? record.fromBlock
      : record.fromBlock.toString(),
    toBlock: isNil(record.toBlock) ? record.toBlock : record.toBlock.toString(),
    fromTimestamp: fromTimestamp(record.fromTimestamp),
    toTimestamp: fromTimestamp(record.toTimestamp),
  }
}

export class InteropPluginSyncedRangeRepository extends BaseRepository {
  async upsert(record: InteropPluginSyncedRangeRecord): Promise<void> {
    await this.db
      .insertInto('InteropPluginSyncedRange')
      .values(toRow(record))
      .onConflict((cb) =>
        cb.columns(['pluginName', 'chain']).doUpdateSet((eb) => ({
          fromBlock: eb.ref('excluded.fromBlock'),
          fromTimestamp: eb.ref('excluded.fromTimestamp'),
          toBlock: eb.ref('excluded.toBlock'),
          toTimestamp: eb.ref('excluded.toTimestamp'),
        })),
      )
      .execute()
  }

  async getAll(): Promise<InteropPluginSyncedRangeRecord[]> {
    const rows = await this.db
      .selectFrom('InteropPluginSyncedRange')
      .selectAll()
      .orderBy(['pluginName', 'chain'])
      .execute()

    return rows.map(toRecord)
  }

  async findByPluginNameAndChain(
    pluginName: string,
    chain: string,
  ): Promise<InteropPluginSyncedRangeRecord | undefined> {
    const row = await this.db
      .selectFrom('InteropPluginSyncedRange')
      .selectAll()
      .where('pluginName', '=', pluginName)
      .where('chain', '=', chain)
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async updateByPluginNameAndChain(
    pluginName: string,
    chain: string,
    patch: InteropPluginSyncedRangeUpdateable,
  ): Promise<number> {
    const result = await this.db
      .updateTable('InteropPluginSyncedRange')
      .set(toUpdateRow(patch))
      .where('pluginName', '=', pluginName)
      .where('chain', '=', chain)
      .executeTakeFirst()

    return Number(result.numUpdatedRows)
  }

  async deleteByPluginName(pluginName: string): Promise<number> {
    const result = await this.db
      .deleteFrom('InteropPluginSyncedRange')
      .where('pluginName', '=', pluginName)
      .executeTakeFirst()

    return Number(result.numDeletedRows)
  }

  async deleteByPluginNameAndChain(
    pluginName: string,
    chain: string,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('InteropPluginSyncedRange')
      .where('pluginName', '=', pluginName)
      .where('chain', '=', chain)
      .executeTakeFirst()

    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('InteropPluginSyncedRange')
      .executeTakeFirst()

    return Number(result.numDeletedRows)
  }

  async deleteNotInPluginNames(validPluginNames: string[]): Promise<number> {
    if (validPluginNames.length === 0) {
      return 0
    }
    const result = await this.db
      .deleteFrom('InteropPluginSyncedRange')
      .where('pluginName', 'not in', validPluginNames)
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
