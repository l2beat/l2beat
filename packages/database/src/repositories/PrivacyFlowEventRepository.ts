import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { PrivacyFlowEvent } from '../kysely/generated/types'

export type PrivacyFlowDirection = 'deposit' | 'withdrawal'

export interface PrivacyFlowEventRecord {
  configurationId: string
  projectId: string
  bucketId: string
  chain: string
  direction: PrivacyFlowDirection
  timestamp: UnixTime
  blockNumber: number
  txHash: string
  logIndex: number
  count: number
  amount: bigint
  priceId: string
  valueUsd: number
}

export interface PrivacyFlowDailyRecord {
  projectId: string
  bucketId: string
  timestamp: UnixTime
  depositCount: number
  withdrawalCount: number
  depositAmount: bigint
  withdrawalAmount: bigint
  depositValueUsd: number
  withdrawalValueUsd: number
}

export interface PrivacyFlowBucketTotalRecord {
  projectId: string
  bucketId: string
  depositCount: number
  withdrawalCount: number
  depositAmount: bigint
  withdrawalAmount: bigint
  depositValueUsd: number
  withdrawalValueUsd: number
}

export function toRecord(
  row: Selectable<PrivacyFlowEvent>,
): PrivacyFlowEventRecord {
  return {
    ...row,
    direction: row.direction as PrivacyFlowDirection,
    timestamp: UnixTime.fromDate(row.timestamp),
    amount: BigInt(row.amount),
  }
}

export function toRow(
  record: PrivacyFlowEventRecord,
): Insertable<PrivacyFlowEvent> {
  return {
    ...record,
    timestamp: UnixTime.toDate(record.timestamp),
    amount: record.amount.toString(),
  }
}

export class PrivacyFlowEventRepository extends BaseRepository {
  async upsertMany(records: PrivacyFlowEventRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 2_000, async (batch) => {
      await this.db
        .insertInto('PrivacyFlowEvent')
        .values(batch)
        .onConflict((oc) =>
          oc
            .columns(['configurationId', 'txHash', 'logIndex'])
            .doUpdateSet((eb) => ({
              projectId: eb.ref('excluded.projectId'),
              bucketId: eb.ref('excluded.bucketId'),
              chain: eb.ref('excluded.chain'),
              direction: eb.ref('excluded.direction'),
              timestamp: eb.ref('excluded.timestamp'),
              blockNumber: eb.ref('excluded.blockNumber'),
              count: eb.ref('excluded.count'),
              amount: eb.ref('excluded.amount'),
              priceId: eb.ref('excluded.priceId'),
              valueUsd: eb.ref('excluded.valueUsd'),
            })),
        )
        .execute()
    })

    return rows.length
  }

  async getDailyByProjectIds(
    projectIds: string[],
    fromInclusive: UnixTime | null,
    toExclusive: UnixTime,
  ): Promise<PrivacyFlowDailyRecord[]> {
    if (projectIds.length === 0) return []

    const day = sql<Date>`date_trunc('day', "timestamp")`
    let query = this.db
      .selectFrom('PrivacyFlowEvent')
      .select((eb) => [
        'projectId',
        'bucketId',
        day.as('timestamp'),
        eb.fn
          .sum('count')
          .filterWhere('direction', '=', 'deposit')
          .as('depositCount'),
        eb.fn
          .sum('count')
          .filterWhere('direction', '=', 'withdrawal')
          .as('withdrawalCount'),
        eb.fn
          .coalesce(
            eb.fn.sum('amount').filterWhere('direction', '=', 'deposit'),
            sql<string>`'0'`,
          )
          .as('depositAmount'),
        eb.fn
          .coalesce(
            eb.fn.sum('amount').filterWhere('direction', '=', 'withdrawal'),
            sql<string>`'0'`,
          )
          .as('withdrawalAmount'),
        eb.fn
          .sum('valueUsd')
          .filterWhere('direction', '=', 'deposit')
          .as('depositValueUsd'),
        eb.fn
          .sum('valueUsd')
          .filterWhere('direction', '=', 'withdrawal')
          .as('withdrawalValueUsd'),
      ])
      .where('projectId', 'in', projectIds)

    if (fromInclusive !== null) {
      query = query.where('timestamp', '>=', UnixTime.toDate(fromInclusive))
    }

    query = query
      .where('timestamp', '<', UnixTime.toDate(toExclusive))
      .groupBy(['projectId', 'bucketId', day])
      .orderBy('timestamp', 'asc')

    const rows = await query.execute()

    return rows.map((row) => ({
      projectId: row.projectId,
      bucketId: row.bucketId,
      timestamp: UnixTime.fromDate(row.timestamp),
      depositCount: Number(row.depositCount ?? 0),
      withdrawalCount: Number(row.withdrawalCount ?? 0),
      depositAmount: BigInt(row.depositAmount),
      withdrawalAmount: BigInt(row.withdrawalAmount),
      depositValueUsd: Number(row.depositValueUsd ?? 0),
      withdrawalValueUsd: Number(row.withdrawalValueUsd ?? 0),
    }))
  }

  async deleteByConfigInBlockRange(
    configurationId: string,
    fromInclusive: number,
    toInclusive: number,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('PrivacyFlowEvent')
      .where('configurationId', '=', configurationId)
      .where('blockNumber', '>=', fromInclusive)
      .where('blockNumber', '<=', toInclusive)
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteByConfigInTimeRange(
    configurationId: string,
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('PrivacyFlowEvent')
      .where('configurationId', '=', configurationId)
      .where('timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('timestamp', '<=', UnixTime.toDate(toInclusive))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteByConfigIds(ids: string[]): Promise<number> {
    if (ids.length === 0) return 0
    const result = await this.db
      .deleteFrom('PrivacyFlowEvent')
      .where('configurationId', 'in', ids)
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getBucketTotalsByProjectIds(
    projectIds: string[],
  ): Promise<PrivacyFlowBucketTotalRecord[]> {
    if (projectIds.length === 0) return []

    const rows = await this.db
      .selectFrom('PrivacyFlowEvent')
      .select((eb) => [
        'projectId',
        'bucketId',
        eb.fn
          .sum('count')
          .filterWhere('direction', '=', 'deposit')
          .as('depositCount'),
        eb.fn
          .sum('count')
          .filterWhere('direction', '=', 'withdrawal')
          .as('withdrawalCount'),
        eb.fn
          .coalesce(
            eb.fn.sum('amount').filterWhere('direction', '=', 'deposit'),
            sql<string>`'0'`,
          )
          .as('depositAmount'),
        eb.fn
          .coalesce(
            eb.fn.sum('amount').filterWhere('direction', '=', 'withdrawal'),
            sql<string>`0`,
          )
          .as('withdrawalAmount'),
        eb.fn
          .sum('valueUsd')
          .filterWhere('direction', '=', 'deposit')
          .as('depositValueUsd'),
        eb.fn
          .sum('valueUsd')
          .filterWhere('direction', '=', 'withdrawal')
          .as('withdrawalValueUsd'),
      ])
      .where('projectId', 'in', projectIds)
      .groupBy(['projectId', 'bucketId'])
      .execute()

    return rows.map((row) => ({
      projectId: row.projectId,
      bucketId: row.bucketId,
      depositCount: Number(row.depositCount ?? 0),
      withdrawalCount: Number(row.withdrawalCount ?? 0),
      depositAmount: BigInt(row.depositAmount),
      withdrawalAmount: BigInt(row.withdrawalAmount),
      depositValueUsd: Number(row.depositValueUsd ?? 0),
      withdrawalValueUsd: Number(row.withdrawalValueUsd ?? 0),
    }))
  }

  async getLatestTimestampByProjectIds(
    projectIds: string[],
  ): Promise<UnixTime | undefined> {
    if (projectIds.length === 0) return undefined

    const row = await this.db
      .selectFrom('PrivacyFlowEvent')
      .select(this.db.fn.max('timestamp').as('maxTimestamp'))
      .where('projectId', 'in', projectIds)
      .executeTakeFirst()

    return row?.maxTimestamp ? UnixTime.fromDate(row.maxTimestamp) : undefined
  }

  async getFirstTimestampByProjectIds(
    projectIds: string[],
  ): Promise<UnixTime | undefined> {
    if (projectIds.length === 0) return undefined

    const row = await this.db
      .selectFrom('PrivacyFlowEvent')
      .select(this.db.fn.min('timestamp').as('minTimestamp'))
      .where('projectId', 'in', projectIds)
      .executeTakeFirst()

    return row?.minTimestamp ? UnixTime.fromDate(row.minTimestamp) : undefined
  }

  async getAll(): Promise<PrivacyFlowEventRecord[]> {
    const rows = await this.db
      .selectFrom('PrivacyFlowEvent')
      .selectAll()
      .execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('PrivacyFlowEvent')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
