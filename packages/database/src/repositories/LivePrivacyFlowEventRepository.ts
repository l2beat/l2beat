import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { LivePrivacyFlowEvent } from '../kysely/generated/types'
import type { PrivacyFlowDirection } from './PrivacyFlowEventRepository'

export interface LivePrivacyFlowEventRecord {
  configurationId: string
  projectId: string
  bucketId: string
  chain: string
  direction: PrivacyFlowDirection
  timestamp: UnixTime
  blockNumber: number
  blockHash: string
  txHash: string
  logIndex: number
  count: number
  amount: bigint
}

function toRecord(
  row: Selectable<LivePrivacyFlowEvent>,
): LivePrivacyFlowEventRecord {
  return {
    ...row,
    direction: row.direction as PrivacyFlowDirection,
    timestamp: UnixTime.fromDate(row.timestamp),
    amount: BigInt(row.amount),
  }
}

function toRow(
  record: LivePrivacyFlowEventRecord,
): Insertable<LivePrivacyFlowEvent> {
  return {
    ...record,
    timestamp: UnixTime.toDate(record.timestamp),
    amount: record.amount.toString(),
  }
}

export class LivePrivacyFlowEventRepository extends BaseRepository {
  async upsertMany(records: LivePrivacyFlowEventRecord[]): Promise<number> {
    if (records.length === 0) return 0

    await this.batch(records.map(toRow), 2_000, async (batch) => {
      await this.db
        .insertInto('LivePrivacyFlowEvent')
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
              blockHash: eb.ref('excluded.blockHash'),
              count: eb.ref('excluded.count'),
              amount: eb.ref('excluded.amount'),
            })),
        )
        .execute()
    })
    return records.length
  }

  /** Both ends included, in the order of the chain */
  async getByChainInBlockRange(
    chain: string,
    from: number,
    to: number,
  ): Promise<LivePrivacyFlowEventRecord[]> {
    const rows = await this.db
      .selectFrom('LivePrivacyFlowEvent')
      .selectAll()
      .where('chain', '=', chain)
      .where('blockNumber', '>=', from)
      .where('blockNumber', '<=', to)
      .orderBy('blockNumber')
      .orderBy('logIndex')
      .orderBy('configurationId')
      .execute()
    return rows.map(toRecord)
  }

  async deleteByChainAfter(
    chain: string,
    blockNumber: number,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('LivePrivacyFlowEvent')
      .where('chain', '=', chain)
      .where('blockNumber', '>', blockNumber)
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteByChainBefore(
    chain: string,
    timestamp: UnixTime,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('LivePrivacyFlowEvent')
      .where('chain', '=', chain)
      .where('timestamp', '<', UnixTime.toDate(timestamp))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  /** Deletes the flows of every chain but the given ones */
  async deleteOfOtherChains(chains: string[]): Promise<number> {
    let query = this.db.deleteFrom('LivePrivacyFlowEvent')
    if (chains.length > 0) {
      query = query.where('chain', 'not in', chains)
    }
    const result = await query.executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getAll(): Promise<LivePrivacyFlowEventRecord[]> {
    const rows = await this.db
      .selectFrom('LivePrivacyFlowEvent')
      .selectAll()
      .orderBy('chain')
      .orderBy('blockNumber')
      .orderBy('logIndex')
      .orderBy('configurationId')
      .execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('LivePrivacyFlowEvent')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
