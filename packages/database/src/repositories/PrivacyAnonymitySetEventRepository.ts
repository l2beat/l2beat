import { UnixTime } from '@l2beat/shared-pure'
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
  sender: string
  amount: bigint
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
  return {
    ...row,
    timestamp: UnixTime.fromDate(row.timestamp),
    amount: BigInt(row.amount),
  }
}

function toRow(
  record: PrivacyAnonymitySetEventRecord,
): Insertable<PrivacyAnonymitySetEvent> {
  return {
    ...record,
    timestamp: UnixTime.toDate(record.timestamp),
    amount: record.amount.toString(),
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
      .groupBy(['projectId', 'bucketId', 'sender', day])
      .orderBy('timestamp', 'asc')
      .execute()

    return rows.map((row) => ({
      projectId: row.projectId,
      bucketId: row.bucketId,
      timestamp: UnixTime.fromDate(row.timestamp),
      sender: row.sender,
      maximumAmount: BigInt(row.maximumAmount),
    }))
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
