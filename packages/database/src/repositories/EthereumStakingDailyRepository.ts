import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { EthereumStakingDaily } from '../kysely/generated/types'

/** One UTC day of Ethereum staking, amounts in wei. */
export interface EthereumStakingDailyRecord {
  /** Start of the day. */
  timestamp: UnixTime
  /** The beacon state read: the last slot before the day starts. */
  slot: number
  /** Sum of every validator's balance. */
  totalBalance: bigint
  /** Deposits waiting to be credited; null before Pectra. */
  pendingDeposits: bigint | null
  /** Withdrawals paid in the day's blocks. */
  withdrawals: bigint
  /** Deposit contract deposits in the day's blocks. */
  deposits: bigint
  /** What proposers earned from the day's blocks. */
  executionRewards: bigint
  blockCount: number
}

function toRecord(
  row: Selectable<EthereumStakingDaily>,
): EthereumStakingDailyRecord {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    slot: row.slot,
    totalBalance: BigInt(row.totalBalance),
    pendingDeposits:
      row.pendingDeposits === null ? null : BigInt(row.pendingDeposits),
    withdrawals: BigInt(row.withdrawals),
    deposits: BigInt(row.deposits),
    executionRewards: BigInt(row.executionRewards),
    blockCount: row.blockCount,
  }
}

function toRow(
  record: EthereumStakingDailyRecord,
): Insertable<EthereumStakingDaily> {
  return {
    timestamp: UnixTime.toDate(record.timestamp),
    slot: record.slot,
    totalBalance: record.totalBalance.toString(),
    pendingDeposits: record.pendingDeposits?.toString() ?? null,
    withdrawals: record.withdrawals.toString(),
    deposits: record.deposits.toString(),
    executionRewards: record.executionRewards.toString(),
    blockCount: record.blockCount,
  }
}

export class EthereumStakingDailyRepository extends BaseRepository {
  async upsertMany(records: EthereumStakingDailyRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 2_000, async (batch) => {
      await this.db
        .insertInto('EthereumStakingDaily')
        .values(batch)
        .onConflict((cb) =>
          cb.column('timestamp').doUpdateSet((eb) => ({
            slot: eb.ref('excluded.slot'),
            totalBalance: eb.ref('excluded.totalBalance'),
            pendingDeposits: eb.ref('excluded.pendingDeposits'),
            withdrawals: eb.ref('excluded.withdrawals'),
            deposits: eb.ref('excluded.deposits'),
            executionRewards: eb.ref('excluded.executionRewards'),
            blockCount: eb.ref('excluded.blockCount'),
          })),
        )
        .execute()
    })
    return rows.length
  }

  /** Oldest first. */
  async getInRange(
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<EthereumStakingDailyRecord[]> {
    const rows = await this.db
      .selectFrom('EthereumStakingDaily')
      .selectAll()
      .where('timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('timestamp', '<=', UnixTime.toDate(toInclusive))
      .orderBy('timestamp', 'asc')
      .execute()
    return rows.map(toRecord)
  }

  /** Removes the days after `from`, for an indexer invalidating its height. */
  async deleteAfter(from: UnixTime): Promise<number> {
    const result = await this.db
      .deleteFrom('EthereumStakingDaily')
      .where('timestamp', '>', UnixTime.toDate(from))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getAll(): Promise<EthereumStakingDailyRecord[]> {
    const rows = await this.db
      .selectFrom('EthereumStakingDaily')
      .selectAll()
      .orderBy('timestamp', 'asc')
      .execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('EthereumStakingDaily')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
