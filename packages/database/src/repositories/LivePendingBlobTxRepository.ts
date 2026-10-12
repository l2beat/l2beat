import { ProjectId } from '@l2beat/shared-pure'
import { type Insertable, type Selectable, sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { LivePendingBlobTx } from '../kysely/generated/types'

/** A blob transaction heard of in the mempool, by its sender and nonce */
export interface LivePendingBlobTxRecord {
  from: string
  nonce: number
  /** Of the newest version heard of: a fee bump resends it under a new hash */
  txHash: string
  to: string
  blobs: number
  /** Missing when no project claims it */
  projectId: ProjectId | undefined
  /** Unix seconds, with the fraction: the lane orders batches heard within one second */
  firstSeenAt: number
  /** Unix seconds, with the fraction */
  lastSeenAt: number
}

export interface LivePendingBlobTxKey {
  from: string
  nonce: number
}

export function toRecord(
  row: Selectable<LivePendingBlobTx>,
): LivePendingBlobTxRecord {
  return {
    ...row,
    projectId: row.projectId === null ? undefined : ProjectId(row.projectId),
    firstSeenAt: row.firstSeenAt.getTime() / 1000,
    lastSeenAt: row.lastSeenAt.getTime() / 1000,
  }
}

export function toRow(
  record: LivePendingBlobTxRecord,
): Insertable<LivePendingBlobTx> {
  return {
    ...record,
    projectId: record.projectId ?? null,
    firstSeenAt: new Date(record.firstSeenAt * 1000),
    lastSeenAt: new Date(record.lastSeenAt * 1000),
  }
}

export class LivePendingBlobTxRepository extends BaseRepository {
  /** A resend of a known batch keeps when it was first heard of */
  async upsert(record: LivePendingBlobTxRecord): Promise<void> {
    await this.db
      .insertInto('LivePendingBlobTx')
      .values(toRow(record))
      .onConflict((cb) =>
        cb.columns(['from', 'nonce']).doUpdateSet((eb) => ({
          txHash: eb.ref('excluded.txHash'),
          to: eb.ref('excluded.to'),
          blobs: eb.ref('excluded.blobs'),
          projectId: eb.ref('excluded.projectId'),
          lastSeenAt: eb.ref('excluded.lastSeenAt'),
        })),
      )
      .execute()
  }

  /**
   * The newest `limit` batches that no stored block took, oldest first. A
   * block that took a higher nonce of the sender took this one's place too,
   * as nonces are used in order
   */
  async getWaiting(limit: number): Promise<LivePendingBlobTxRecord[]> {
    const rows = await this.db
      .selectFrom('LivePendingBlobTx as p')
      .selectAll('p')
      .where(({ not, exists, selectFrom }) =>
        not(
          exists(
            selectFrom('LiveBlobBatch as b')
              .select(sql`1`.as('one'))
              .whereRef('b.from', '=', 'p.from')
              .whereRef('b.nonce', '>=', 'p.nonce'),
          ),
        ),
      )
      .orderBy('p.firstSeenAt', 'desc')
      .limit(limit)
      .execute()
    return rows.map(toRecord).reverse()
  }

  /**
   * Changes whenever a row does: a row heard of moves the newest `lastSeenAt`
   * on, and one deleted lowers the count. Read many times a second, it saves
   * reading the rows while nothing changed
   */
  async getChangeMark(): Promise<string> {
    const row = await this.db
      .selectFrom('LivePendingBlobTx')
      .select((eb) => [
        eb.fn.countAll<string>().as('count'),
        eb.fn.max('lastSeenAt').as('lastSeenAt'),
      ])
      .executeTakeFirstOrThrow()
    return `${row.count}:${row.lastSeenAt?.getTime() ?? 0}`
  }

  /** When each of the batches was first heard of, by `from:nonce`, for the ones that were */
  async getFirstSeen(
    keys: LivePendingBlobTxKey[],
  ): Promise<Map<string, number>> {
    if (keys.length === 0) return new Map()
    const rows = await this.db
      .selectFrom('LivePendingBlobTx')
      .select(['from', 'nonce', 'firstSeenAt'])
      .where(
        sql<boolean>`("from", "nonce") IN (${sql.join(
          keys.map((key) => sql`(${key.from}, ${key.nonce})`),
        )})`,
      )
      .execute()
    return new Map(
      rows.map((row) => [pendingKey(row), row.firstSeenAt.getTime() / 1000]),
    )
  }

  async deleteSeenBefore(time: number): Promise<number> {
    const result = await this.db
      .deleteFrom('LivePendingBlobTx')
      .where('lastSeenAt', '<', new Date(time * 1000))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('LivePendingBlobTx')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}

/** Names a batch across fee-bump resends, in the mempool and in its block */
export function pendingKey({ from, nonce }: LivePendingBlobTxKey) {
  return `${from}:${nonce}`
}
