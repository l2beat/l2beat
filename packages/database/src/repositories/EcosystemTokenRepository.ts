import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { EcosystemToken } from '../kysely/generated/types'

export interface EcosystemTokenRecord {
  projectId: string
  coingeckoId: string
  configurationId: string
  priceUsd: number
  price7dChange: number
  marketCapUsd: number
  marketCap7dChange: number
  circulatingSupply: number
  circulatingSupply7dChange: number
  timestamp: UnixTime
}

export function toRecord(
  entity: Selectable<EcosystemToken>,
): EcosystemTokenRecord {
  return {
    ...entity,
    timestamp: UnixTime.fromDate(entity.timestamp),
  }
}

export function toRow(
  ecosystemToken: Omit<EcosystemTokenRecord, 'updatedAt'>,
): Insertable<EcosystemToken> {
  return {
    ...ecosystemToken,
    timestamp: UnixTime.toDate(ecosystemToken.timestamp),
  }
}

export class EcosystemTokenRepository extends BaseRepository {
  async getAll(): Promise<EcosystemTokenRecord[]> {
    const rows = await this.db
      .selectFrom('EcosystemToken')
      .selectAll()
      .execute()
    return rows.map(toRecord)
  }

  async findByCoingeckoId(
    coingeckoId: string,
  ): Promise<EcosystemTokenRecord | undefined> {
    const row = await this.db
      .selectFrom('EcosystemToken')
      .selectAll()
      .where('coingeckoId', '=', coingeckoId)
      .limit(1)
      .executeTakeFirst()
    return row && toRecord(row)
  }

  async getByCoingeckoIds(
    coingeckoIds: string[],
  ): Promise<EcosystemTokenRecord[]> {
    if (coingeckoIds.length === 0) return []

    const rows = await this.db
      .selectFrom('EcosystemToken')
      .selectAll()
      .where('coingeckoId', 'in', coingeckoIds)
      .execute()
    return rows.map(toRecord)
  }

  async upsertMany(records: EcosystemTokenRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.db
      .insertInto('EcosystemToken')
      .values(rows)
      .onConflict((oc) =>
        oc
          .columns(['projectId', 'coingeckoId', 'configurationId'])
          .doUpdateSet((eb) => ({
            priceUsd: eb.ref('excluded.priceUsd'),
            price7dChange: eb.ref('excluded.price7dChange'),
            marketCapUsd: eb.ref('excluded.marketCapUsd'),
            marketCap7dChange: eb.ref('excluded.marketCap7dChange'),
            circulatingSupply: eb.ref('excluded.circulatingSupply'),
            circulatingSupply7dChange: eb.ref(
              'excluded.circulatingSupply7dChange',
            ),
            timestamp: eb.ref('excluded.timestamp'),
          })),
      )
      .executeTakeFirst()
    return records.length
  }

  async deleteByConfigurationId(configurationId: string): Promise<number> {
    const result = await this.db
      .deleteFrom('EcosystemToken')
      .where('configurationId', '=', configurationId)
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('EcosystemToken').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
