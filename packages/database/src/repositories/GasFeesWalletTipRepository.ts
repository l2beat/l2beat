import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { GasFeesWalletTip } from '../kysely/generated/types'
import type { GasFeesTier } from './GasFeesTipHourlyRepository'

export type GasFeesWallet = 'MetaMask' | 'Rabby' | 'Ambire'

export interface GasFeesWalletTipRecord {
  wallet: GasFeesWallet
  /** The wallet's own name for this option. */
  option: string
  /** The tier it is shown beside. Wallets make their own promises, so this is not a match. */
  tier: GasFeesTier
  tipGwei: number
  readAt: UnixTime
}

function toRecord(row: Selectable<GasFeesWalletTip>): GasFeesWalletTipRecord {
  return {
    ...row,
    wallet: row.wallet as GasFeesWallet,
    tier: row.tier as GasFeesTier,
    readAt: UnixTime.fromDate(row.readAt),
  }
}

function toRow(record: GasFeesWalletTipRecord): Insertable<GasFeesWalletTip> {
  return { ...record, readAt: UnixTime.toDate(record.readAt) }
}

export class GasFeesWalletTipRepository extends BaseRepository {
  async upsertMany(records: GasFeesWalletTipRecord[]): Promise<number> {
    if (records.length === 0) return 0
    await this.db
      .insertInto('GasFeesWalletTip')
      .values(records.map(toRow))
      .onConflict((cb) =>
        cb.columns(['wallet', 'option']).doUpdateSet((eb) => ({
          tier: eb.ref('excluded.tier'),
          tipGwei: eb.ref('excluded.tipGwei'),
          readAt: eb.ref('excluded.readAt'),
        })),
      )
      .execute()
    return records.length
  }

  async getAll(): Promise<GasFeesWalletTipRecord[]> {
    const rows = await this.db
      .selectFrom('GasFeesWalletTip')
      .selectAll()
      .orderBy('wallet', 'asc')
      .orderBy('option', 'asc')
      .execute()
    return rows.map(toRecord)
  }

  /** Removes the reads older than `timestamp`. */
  async deleteReadBefore(timestamp: UnixTime): Promise<number> {
    const result = await this.db
      .deleteFrom('GasFeesWalletTip')
      .where('readAt', '<', UnixTime.toDate(timestamp))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('GasFeesWalletTip')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
