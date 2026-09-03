import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { PrivacyRelayerActivity } from '../kysely/generated/types'

export interface PrivacyRelayerActivityRecord {
  configurationId: string
  projectId: string
  chain: string
  timestamp: UnixTime
  blockNumber: number
  txHash: string
  logIndex: number
  relayerAddress: EthereumAddress
}

function toRecord(
  row: Selectable<PrivacyRelayerActivity>,
): PrivacyRelayerActivityRecord {
  return {
    ...row,
    timestamp: UnixTime.fromDate(row.timestamp),
    relayerAddress: EthereumAddress(row.relayerAddress),
  }
}

function toRow(
  record: PrivacyRelayerActivityRecord,
): Insertable<PrivacyRelayerActivity> {
  return {
    ...record,
    timestamp: UnixTime.toDate(record.timestamp),
    relayerAddress: record.relayerAddress.toString(),
  }
}

export class PrivacyRelayerActivityRepository extends BaseRepository {
  async upsertMany(records: PrivacyRelayerActivityRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 2_000, async (batch) => {
      await this.db
        .insertInto('PrivacyRelayerActivity')
        .values(batch)
        .onConflict((oc) =>
          oc
            .columns(['configurationId', 'txHash', 'logIndex'])
            .doUpdateSet((eb) => ({
              projectId: eb.ref('excluded.projectId'),
              chain: eb.ref('excluded.chain'),
              timestamp: eb.ref('excluded.timestamp'),
              blockNumber: eb.ref('excluded.blockNumber'),
              relayerAddress: eb.ref('excluded.relayerAddress'),
            })),
        )
        .execute()
    })

    return rows.length
  }

  async getActiveRelayerCount(
    projectId: string,
    fromInclusive: UnixTime,
    toExclusive: UnixTime,
  ): Promise<number> {
    const row = await this.db
      .selectFrom('PrivacyRelayerActivity')
      .select(sql<number>`COUNT(DISTINCT "relayerAddress")`.as('relayerCount'))
      .where('projectId', '=', projectId)
      .where('timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('timestamp', '<', UnixTime.toDate(toExclusive))
      .executeTakeFirstOrThrow()

    return Number(row.relayerCount)
  }

  async deleteByConfigInTimeRange(
    configurationId: string,
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('PrivacyRelayerActivity')
      .where('configurationId', '=', configurationId)
      .where('timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('timestamp', '<=', UnixTime.toDate(toInclusive))
      .executeTakeFirst()

    return Number(result.numDeletedRows)
  }

  async deleteByConfigIds(configurationIds: string[]): Promise<number> {
    if (configurationIds.length === 0) return 0

    const result = await this.db
      .deleteFrom('PrivacyRelayerActivity')
      .where('configurationId', 'in', configurationIds)
      .executeTakeFirst()

    return Number(result.numDeletedRows)
  }

  async getAll(): Promise<PrivacyRelayerActivityRecord[]> {
    const rows = await this.db
      .selectFrom('PrivacyRelayerActivity')
      .selectAll()
      .execute()

    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('PrivacyRelayerActivity')
      .executeTakeFirst()

    return Number(result.numDeletedRows)
  }
}
