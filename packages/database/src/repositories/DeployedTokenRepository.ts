import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { DeployedToken } from '../kysely/generated/types'

export interface DeployedTokenRecord {
  id: string
  abstractTokenId: string | undefined
  symbol: string
  decimals: number
  deploymentTimestamp: UnixTime
}

export function toRecord(row: Selectable<DeployedToken>): DeployedTokenRecord {
  return {
    id: row.id,
    abstractTokenId: row.abstractTokenId ?? undefined,
    symbol: row.symbol,
    decimals: row.decimals,
    deploymentTimestamp: UnixTime.fromDate(row.deploymentTimestamp),
  }
}

export function toRow(record: DeployedTokenRecord): Insertable<DeployedToken> {
  return {
    id: record.id,
    abstractTokenId: record.abstractTokenId,
    symbol: record.symbol,
    decimals: record.decimals,
    deploymentTimestamp: UnixTime.toDate(record.deploymentTimestamp),
  }
}

export class DeployedTokenRepository extends BaseRepository {
  async upsert(record: DeployedTokenRecord): Promise<void> {
    await this.upsertMany([record])
  }

  async upsertMany(records: DeployedTokenRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('DeployedToken')
        .values(batch)
        .onConflict((oc) =>
          oc.columns(['id']).doUpdateSet((eb) => ({
            abstractTokenId: eb.ref('excluded.abstractTokenId'),
            symbol: eb.ref('excluded.symbol'),
            decimals: eb.ref('excluded.decimals'),
            deploymentTimestamp: eb.ref('excluded.deploymentTimestamp'),
          })),
        )
        .execute()
    })

    return records.length
  }

  async findById(id: string): Promise<DeployedTokenRecord | undefined> {
    const row = await this.db
      .selectFrom('DeployedToken')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async findByIdSubstring(
    subs: string,
  ): Promise<DeployedTokenRecord | undefined> {
    const row = await this.db
      .selectFrom('DeployedToken')
      .selectAll()
      .where('id', 'ilike', `%${subs}%`)
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async getByIds(ids: string[]): Promise<DeployedTokenRecord[]> {
    if (ids.length === 0) return []

    const rows = await this.db
      .selectFrom('DeployedToken')
      .selectAll()
      .where('id', 'in', ids)
      .execute()

    return rows.map(toRecord)
  }

  async getByAbstractTokenIds(
    abstractTokenIds: string[],
  ): Promise<DeployedTokenRecord[]> {
    if (abstractTokenIds.length === 0) return []

    const rows = await this.db
      .selectFrom('DeployedToken')
      .selectAll()
      .where('abstractTokenId', 'in', abstractTokenIds)
      .execute()

    return rows.map(toRecord)
  }

  async getAll(): Promise<DeployedTokenRecord[]> {
    const rows = await this.db.selectFrom('DeployedToken').selectAll().execute()
    return rows.map(toRecord)
  }

  async deleteByIds(ids: string[]): Promise<number> {
    if (ids.length === 0) return 0

    const result = await this.db
      .deleteFrom('DeployedToken')
      .where('id', 'in', ids)
      .executeTakeFirst()

    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('DeployedToken').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
