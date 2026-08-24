import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { PrivacyRelayerSample } from '../kysely/generated/types'

export interface PrivacyRelayerSampleRecord {
  configurationId: string
  projectId: string
  chain: string
  timestamp: UnixTime
  relayerCount: number
  messagesReceived: number
  messagesParsed: number
  messagesAccepted: number
}

function toRecord(
  row: Selectable<PrivacyRelayerSample>,
): PrivacyRelayerSampleRecord {
  return {
    ...row,
    timestamp: UnixTime.fromDate(row.timestamp),
  }
}

function toRow(
  record: PrivacyRelayerSampleRecord,
): Insertable<PrivacyRelayerSample> {
  return {
    ...record,
    timestamp: UnixTime.toDate(record.timestamp),
  }
}

export class PrivacyRelayerSampleRepository extends BaseRepository {
  async upsertMany(records: PrivacyRelayerSampleRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 2_000, async (batch) => {
      await this.db
        .insertInto('PrivacyRelayerSample')
        .values(batch)
        .onConflict((oc) =>
          oc.columns(['configurationId', 'timestamp']).doUpdateSet((eb) => ({
            projectId: eb.ref('excluded.projectId'),
            chain: eb.ref('excluded.chain'),
            relayerCount: eb.ref('excluded.relayerCount'),
            messagesReceived: eb.ref('excluded.messagesReceived'),
            messagesParsed: eb.ref('excluded.messagesParsed'),
            messagesAccepted: eb.ref('excluded.messagesAccepted'),
          })),
        )
        .execute()
    })

    return rows.length
  }

  async getConfigurationIdsByTimestamp(
    configurationIds: string[],
    timestamp: UnixTime,
  ): Promise<string[]> {
    if (configurationIds.length === 0) return []

    const rows = await this.db
      .selectFrom('PrivacyRelayerSample')
      .select('configurationId')
      .where('configurationId', 'in', configurationIds)
      .where('timestamp', '=', UnixTime.toDate(timestamp))
      .execute()

    return rows.map((row) => row.configurationId)
  }

  async getAverageRelayerCount(
    projectId: string,
    fromInclusive: UnixTime,
    toExclusive: UnixTime,
  ): Promise<number | undefined> {
    const row = await this.db
      .selectFrom('PrivacyRelayerSample')
      .select(sql<number | null>`AVG("relayerCount")`.as('averageCount'))
      .where('projectId', '=', projectId)
      .where('timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('timestamp', '<', UnixTime.toDate(toExclusive))
      .executeTakeFirst()

    if (row?.averageCount === undefined || row.averageCount === null) {
      return undefined
    }

    return Number(row.averageCount)
  }

  async deleteByConfigInTimeRange(
    configurationId: string,
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('PrivacyRelayerSample')
      .where('configurationId', '=', configurationId)
      .where('timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('timestamp', '<=', UnixTime.toDate(toInclusive))
      .executeTakeFirst()

    return Number(result.numDeletedRows)
  }

  async deleteByConfigIds(configurationIds: string[]): Promise<number> {
    if (configurationIds.length === 0) return 0

    const result = await this.db
      .deleteFrom('PrivacyRelayerSample')
      .where('configurationId', 'in', configurationIds)
      .executeTakeFirst()

    return Number(result.numDeletedRows)
  }

  async getAll(): Promise<PrivacyRelayerSampleRecord[]> {
    const rows = await this.db
      .selectFrom('PrivacyRelayerSample')
      .selectAll()
      .execute()

    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('PrivacyRelayerSample')
      .executeTakeFirst()

    return Number(result.numDeletedRows)
  }
}
