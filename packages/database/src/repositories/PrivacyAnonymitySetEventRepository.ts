import { assert, UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { PrivacyAnonymitySetEvent } from '../kysely/generated/types'

export interface PrivacyAnonymitySetEventRecord {
  configurationId: string
  projectId: string
  bucketId: string
  chain: string
  timestamp: UnixTime
  blockNumber: number
  txHash: string
  logIndex: number
  sender: string | null
  amount: bigint
  /** Note lifecycle events carry no depositor. Only the deposit carries expiry. */
  note?: { id: number; active: boolean; expiresAt: UnixTime | null }
}

export interface PrivacyAnonymitySetSenderDayRecord {
  projectId: string
  bucketId: string
  timestamp: UnixTime
  sender: string
  maximumAmount: bigint
}

function toRecord(
  row: Selectable<PrivacyAnonymitySetEvent>,
): PrivacyAnonymitySetEventRecord {
  const { noteId, active, expiresAt, ...event } = row
  let note: PrivacyAnonymitySetEventRecord['note']
  if (noteId !== null) {
    assert(active !== null, 'Note event is missing its active status')
    note = {
      id: Number(noteId),
      active,
      expiresAt: expiresAt === null ? null : UnixTime.fromDate(expiresAt),
    }
  }
  return {
    ...event,
    timestamp: UnixTime.fromDate(row.timestamp),
    amount: BigInt(row.amount),
    ...(note && { note }),
  }
}

function toRow(
  record: PrivacyAnonymitySetEventRecord,
): Insertable<PrivacyAnonymitySetEvent> {
  const { note, ...event } = record
  return {
    ...event,
    timestamp: UnixTime.toDate(record.timestamp),
    amount: record.amount.toString(),
    noteId: note?.id.toString() ?? null,
    active: note?.active ?? null,
    expiresAt: note?.expiresAt == null ? null : UnixTime.toDate(note.expiresAt),
  }
}

export class PrivacyAnonymitySetEventRepository extends BaseRepository {
  async upsertMany(records: PrivacyAnonymitySetEventRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 2_000, async (batch) => {
      await this.db
        .insertInto('PrivacyAnonymitySetEvent')
        .values(batch)
        .onConflict((oc) =>
          oc
            .columns(['configurationId', 'txHash', 'logIndex'])
            .doUpdateSet((eb) => ({
              projectId: eb.ref('excluded.projectId'),
              bucketId: eb.ref('excluded.bucketId'),
              chain: eb.ref('excluded.chain'),
              timestamp: eb.ref('excluded.timestamp'),
              blockNumber: eb.ref('excluded.blockNumber'),
              sender: eb.ref('excluded.sender'),
              amount: eb.ref('excluded.amount'),
              noteId: eb.ref('excluded.noteId'),
              active: eb.ref('excluded.active'),
              expiresAt: eb.ref('excluded.expiresAt'),
            })),
        )
        .execute()
    })

    return rows.length
  }

  async getSenderDaysByProjectIds(
    projectIds: string[],
    fromInclusive: UnixTime,
    toExclusive: UnixTime,
  ): Promise<PrivacyAnonymitySetSenderDayRecord[]> {
    if (projectIds.length === 0) return []

    const day = sql<Date>`date_trunc('day', "timestamp")`
    const rows = await this.db
      .selectFrom('PrivacyAnonymitySetEvent')
      .select((eb) => [
        'projectId',
        'bucketId',
        'sender',
        day.as('timestamp'),
        eb.fn.max('amount').as('maximumAmount'),
      ])
      .where('projectId', 'in', projectIds)
      .where('timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('timestamp', '<', UnixTime.toDate(toExclusive))
      .where('noteId', 'is', null)
      .groupBy(['projectId', 'bucketId', 'sender', day])
      .orderBy('timestamp', 'asc')
      .execute()

    return rows.map((row) => {
      assert(row.sender !== null, 'Depositor event is missing its sender')
      return {
        projectId: row.projectId,
        bucketId: row.bucketId,
        timestamp: UnixTime.fromDate(row.timestamp),
        sender: row.sender,
        maximumAmount: BigInt(row.maximumAmount),
      }
    })
  }

  async getNoteEventsByProjectIds(
    projectIds: string[],
    fromInclusive: UnixTime,
    toExclusive: UnixTime,
  ): Promise<PrivacyAnonymitySetEventRecord[]> {
    if (projectIds.length === 0) return []
    const rows = await this.db
      .selectFrom('PrivacyAnonymitySetEvent')
      .selectAll()
      .where('projectId', 'in', projectIds)
      .where('noteId', 'is not', null)
      .where('timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('timestamp', '<', UnixTime.toDate(toExclusive))
      .orderBy('blockNumber', 'asc')
      .orderBy('logIndex', 'asc')
      .execute()
    return rows.map(toRecord)
  }

  async getDepositCount(
    projectId: string,
    bucketIds: string[],
    fromInclusive: UnixTime,
    toExclusive: UnixTime,
  ): Promise<number> {
    if (bucketIds.length === 0) return 0

    const row = await this.db
      .selectFrom('PrivacyAnonymitySetEvent')
      .select((eb) => eb.fn.countAll().as('depositCount'))
      .where('amount', '>', '0')
      .where('projectId', '=', projectId)
      .where('bucketId', 'in', bucketIds)
      .where('timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('timestamp', '<', UnixTime.toDate(toExclusive))
      .executeTakeFirstOrThrow()

    return Number(row.depositCount)
  }

  async deleteByConfigInTimeRange(
    configurationId: string,
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('PrivacyAnonymitySetEvent')
      .where('configurationId', '=', configurationId)
      .where('timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('timestamp', '<=', UnixTime.toDate(toInclusive))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteByConfigIds(configurationIds: string[]): Promise<number> {
    if (configurationIds.length === 0) return 0

    const result = await this.db
      .deleteFrom('PrivacyAnonymitySetEvent')
      .where('configurationId', 'in', configurationIds)
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getAll(): Promise<PrivacyAnonymitySetEventRecord[]> {
    const rows = await this.db
      .selectFrom('PrivacyAnonymitySetEvent')
      .selectAll()
      .execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('PrivacyAnonymitySetEvent')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
