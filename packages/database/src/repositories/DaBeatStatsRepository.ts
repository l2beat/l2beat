import { BaseRepository } from '../BaseRepository'
import type { DaBeatStats } from '../kysely/generated/types'

export interface DaBeatStatsRecord {
  id: string
  totalStake: bigint
  thresholdStake: bigint
  numberOfValidators: number | null
}

export function toRecord(entity: DaBeatStats): DaBeatStatsRecord {
  return {
    id: entity.id,
    totalStake: BigInt(entity.totalStake),
    thresholdStake: BigInt(entity.thresholdStake),
    numberOfValidators: entity.numberOfValidators,
  }
}

export function toRow(stake: DaBeatStatsRecord): DaBeatStats {
  return {
    id: stake.id,
    totalStake: Number(stake.totalStake),
    thresholdStake: Number(stake.thresholdStake),
    numberOfValidators: stake.numberOfValidators,
  }
}

export class DaBeatStatsRepository extends BaseRepository {
  async getAll(): Promise<DaBeatStatsRecord[]> {
    const rows = await this.db.selectFrom('DaBeatStats').selectAll().execute()
    return rows.map(toRecord)
  }

  async findById(id: string): Promise<DaBeatStatsRecord | undefined> {
    const row = await this.db
      .selectFrom('DaBeatStats')
      .selectAll()
      .where('id', '=', id)
      .limit(1)
      .executeTakeFirst()
    return row && toRecord(row)
  }

  async getByIds(ids: string[]): Promise<DaBeatStatsRecord[]> {
    if (ids.length === 0) return []

    const res = await this.db
      .selectFrom('DaBeatStats')
      .selectAll()
      .where('id', 'in', ids)
      .execute()
    return res.map(toRecord)
  }

  async upsert(record: DaBeatStatsRecord): Promise<void> {
    await this.upsertMany([record])
  }

  async upsertMany(records: DaBeatStatsRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1000, async (batch) => {
      await this.db
        .insertInto('DaBeatStats')
        .values(batch)
        .onConflict((oc) =>
          oc.columns(['id']).doUpdateSet((eb) => ({
            thresholdStake: eb.ref('excluded.thresholdStake'),
            totalStake: eb.ref('excluded.totalStake'),
            numberOfValidators: eb.ref('excluded.numberOfValidators'),
          })),
        )
        .execute()
    })
    return records.length
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('DaBeatStats').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
