import { UnixTime } from '@l2beat/shared-pure'
import { type Insertable, type Selectable, sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { LiquidStakingSnapshot } from '../kysely/generated/types'

export interface LiquidStakingSnapshotRecord {
  configurationId: string
  projectId: string
  timestamp: UnixTime
  blockNumber: number
  /** ETH per token, 18 decimals; for Lido per share, i.e. per wstETH. */
  exchangeRate: bigint
  /** Withdrawal queue counters (Lido, ether.fi), or the unwrap request and allocation counters (wBETH). */
  lastRequestId: number | null
  lastFinalizedRequestId: number | null
  /** ETH the protocol pays out at once: burning rETH (Rocket Pool), or the instant redemption (ether.fi), wei. */
  instantExitEth: bigint | null
  /** The instant exit's fee, basis points. */
  instantExitFeeBps: number | null
  /** Lock on an onchain redemption (wBETH), seconds. */
  lockTime: number | null
  /** ETH the best onchain pool pays for 100 tokens, wei; null without a quote. */
  marketExitEth: bigint | null
  /** What those tokens are worth at the protocol's rate, wei. */
  marketExitValueEth: bigint | null
}

function toRecord(
  row: Selectable<LiquidStakingSnapshot>,
): LiquidStakingSnapshotRecord {
  return {
    ...row,
    timestamp: UnixTime.fromDate(row.timestamp),
    exchangeRate: BigInt(row.exchangeRate),
    instantExitEth: toBigInt(row.instantExitEth),
    marketExitEth: toBigInt(row.marketExitEth),
    marketExitValueEth: toBigInt(row.marketExitValueEth),
  }
}

function toRow(
  record: LiquidStakingSnapshotRecord,
): Insertable<LiquidStakingSnapshot> {
  return {
    ...record,
    timestamp: UnixTime.toDate(record.timestamp),
    exchangeRate: record.exchangeRate.toString(),
    instantExitEth: record.instantExitEth?.toString() ?? null,
    marketExitEth: record.marketExitEth?.toString() ?? null,
    marketExitValueEth: record.marketExitValueEth?.toString() ?? null,
  }
}

function toBigInt(value: string | null): bigint | null {
  return value === null ? null : BigInt(value)
}

export class LiquidStakingSnapshotRepository extends BaseRepository {
  async upsertMany(records: LiquidStakingSnapshotRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 2_000, async (batch) => {
      await this.db
        .insertInto('LiquidStakingSnapshot')
        .values(batch)
        .onConflict((cb) =>
          cb.columns(['configurationId', 'timestamp']).doUpdateSet((eb) => ({
            projectId: eb.ref('excluded.projectId'),
            blockNumber: eb.ref('excluded.blockNumber'),
            exchangeRate: eb.ref('excluded.exchangeRate'),
            lastRequestId: eb.ref('excluded.lastRequestId'),
            lastFinalizedRequestId: eb.ref('excluded.lastFinalizedRequestId'),
            instantExitEth: eb.ref('excluded.instantExitEth'),
            instantExitFeeBps: eb.ref('excluded.instantExitFeeBps'),
            lockTime: eb.ref('excluded.lockTime'),
            marketExitEth: eb.ref('excluded.marketExitEth'),
            marketExitValueEth: eb.ref('excluded.marketExitValueEth'),
          })),
        )
        .execute()
    })
    return rows.length
  }

  /** Oldest first. */
  async getByProjectsInRange(
    projectIds: string[],
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<LiquidStakingSnapshotRecord[]> {
    if (projectIds.length === 0) return []

    const rows = await this.db
      .selectFrom('LiquidStakingSnapshot')
      .selectAll()
      .where('projectId', 'in', projectIds)
      .where('timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('timestamp', '<=', UnixTime.toDate(toInclusive))
      .orderBy('timestamp', 'asc')
      .execute()
    return rows.map(toRecord)
  }

  /** Oldest first, only the snapshots that start a UTC day. */
  async getDayStartsByProjectsInRange(
    projectIds: string[],
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<LiquidStakingSnapshotRecord[]> {
    if (projectIds.length === 0) return []

    const rows = await this.db
      .selectFrom('LiquidStakingSnapshot')
      .selectAll()
      .where('projectId', 'in', projectIds)
      .where('timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('timestamp', '<=', UnixTime.toDate(toInclusive))
      .where(sql<boolean>`date_trunc('day', timestamp) = timestamp`)
      .orderBy('timestamp', 'asc')
      .execute()
    return rows.map(toRecord)
  }

  async deleteByConfigIds(ids: string[]): Promise<number> {
    if (ids.length === 0) return 0

    const result = await this.db
      .deleteFrom('LiquidStakingSnapshot')
      .where('configurationId', 'in', ids)
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteByConfigInTimeRange(
    configurationId: string,
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('LiquidStakingSnapshot')
      .where('configurationId', '=', configurationId)
      .where('timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('timestamp', '<=', UnixTime.toDate(toInclusive))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getAll(): Promise<LiquidStakingSnapshotRecord[]> {
    const rows = await this.db
      .selectFrom('LiquidStakingSnapshot')
      .selectAll()
      .execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('LiquidStakingSnapshot')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
