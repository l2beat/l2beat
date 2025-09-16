import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { EcosystemToken } from '../kysely/generated/types'

export interface EcosystemTokenRecord {
  projectId: string
  coingeckoId: string
  priceUsd: number
  marketCapUsd: number
  circulatingSupply: number
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

  async upsert(record: EcosystemTokenRecord): Promise<void> {
    await this.db
      .insertInto('EcosystemToken')
      .values(toRow(record))
      .onConflict((oc) =>
        oc.columns(['projectId', 'coingeckoId']).doUpdateSet((eb) => ({
          priceUsd: eb.ref('excluded.priceUsd'),
          marketCapUsd: eb.ref('excluded.marketCapUsd'),
          circulatingSupply: eb.ref('excluded.circulatingSupply'),
          timestamp: eb.ref('excluded.timestamp'),
        })),
      )
      .execute()
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('EcosystemToken').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
