import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { TvsAmount } from '../kysely/generated/types'

export interface TvsAmountRecord {
  timestamp: UnixTime
  configurationId: string
  amount: bigint
}

export function toRecord(row: Selectable<TvsAmount>): TvsAmountRecord {
  return {
    ...row,
    timestamp: UnixTime.fromDate(row.timestamp),
    amount: BigInt(row.amount),
  }
}

export function toRow(record: TvsAmountRecord): Insertable<TvsAmount> {
  return {
    ...record,
    timestamp: UnixTime.toDate(record.timestamp),
    amount: record.amount.toString(),
  }
}

export class TvsAmountRepository extends BaseRepository {
  async upsertMany(records: TvsAmountRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('TvsAmount')
        .values(batch)
        .onConflict((oc) =>
          oc.columns(['timestamp', 'configurationId']).doUpdateSet((eb) => ({
            amount: eb.ref('excluded.amount'),
          })),
        )
        .execute()
    })
    return rows.length
  }

  async getAmount(
    configurationId: string,
    timestamp: UnixTime,
  ): Promise<TvsAmountRecord | undefined> {
    const row = await this.db
      .selectFrom('TvsAmount')
      .select(['timestamp', 'configurationId', 'amount'])
      .where('configurationId', '=', configurationId)
      .where('timestamp', '=', UnixTime.toDate(timestamp))
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async getAmountsInRange(
    configurationIds: string[],
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<TvsAmountRecord[]> {
    const rows = await this.db
      .selectFrom('TvsAmount')
      .select(['timestamp', 'configurationId', 'amount'])
      .where('configurationId', 'in', configurationIds)
      .where('timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('timestamp', '<=', UnixTime.toDate(toInclusive))
      .execute()

    return rows.map(toRecord)
  }

  async getLatestAmountBefore(
    configurationId: string,
    timestamp: UnixTime,
  ): Promise<TvsAmountRecord | undefined> {
    const row = await this.db
      .selectFrom('TvsAmount')
      .select(['timestamp', 'configurationId', 'amount'])
      .where('configurationId', '=', configurationId)
      .where('timestamp', '<', UnixTime.toDate(timestamp))
      .orderBy('timestamp', 'desc')
      .limit(1)
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async deleteByConfigIds(ids: string[]): Promise<number> {
    if (ids.length === 0) return 0
    const result = await this.db
      .deleteFrom('TvsAmount')
      .where('configurationId', 'in', ids)
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteByConfigs(
    configs: {
      configurationId: string
      fromInclusive: UnixTime
      toInclusive: UnixTime
    }[],
  ): Promise<number> {
    if (configs.length === 0) return 0

    let totalDeleted = 0
    await this.batch(configs, 100, async (batch) => {
      const result = await this.db
        .deleteFrom('TvsAmount')
        .where((eb) =>
          eb.or(
            batch.map((c) =>
              eb.and([
                eb('configurationId', '=', c.configurationId),
                eb('timestamp', '>=', UnixTime.toDate(c.fromInclusive)),
                eb('timestamp', '<=', UnixTime.toDate(c.toInclusive)),
              ]),
            ),
          ),
        )
        .executeTakeFirst()
      totalDeleted += Number(result.numDeletedRows)
    })
    return totalDeleted
  }

  async getAll(): Promise<TvsAmountRecord[]> {
    const rows = await this.db
      .selectFrom('TvsAmount')
      .select(['timestamp', 'configurationId', 'amount'])
      .execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('TvsAmount').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
