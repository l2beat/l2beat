import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { DefiTvl } from '../kysely/generated/types'

export interface DefiTvlRecord {
  timestamp: UnixTime
  sourceTimestamp: UnixTime
  configurationId: string
  projectId: string
  chain: string
  valueUsd: number
}

export interface SummedDefiTvlRecord {
  projectId: string
  timestamp: UnixTime
  sourceTimestamp: UnixTime
  valueUsd: number
  chainCount: number
}

export function toRecord(row: Selectable<DefiTvl>): DefiTvlRecord {
  return {
    ...row,
    timestamp: UnixTime.fromDate(row.timestamp),
    sourceTimestamp: UnixTime.fromDate(row.sourceTimestamp),
  }
}

export function toRow(record: DefiTvlRecord): Insertable<DefiTvl> {
  return {
    ...record,
    timestamp: UnixTime.toDate(record.timestamp),
    sourceTimestamp: UnixTime.toDate(record.sourceTimestamp),
  }
}

export class DefiTvlRepository extends BaseRepository {
  async upsertMany(records: DefiTvlRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 2_000, async (batch) => {
      await this.db
        .insertInto('DefiTvl')
        .values(batch)
        .onConflict((oc) =>
          oc
            .columns(['timestamp', 'configurationId', 'chain'])
            .doUpdateSet((eb) => ({
              sourceTimestamp: eb.ref('excluded.sourceTimestamp'),
              projectId: eb.ref('excluded.projectId'),
              valueUsd: eb.ref('excluded.valueUsd'),
            })),
        )
        .execute()
    })

    return rows.length
  }

  async getLatestByProjects(
    projectIds: string[],
  ): Promise<SummedDefiTvlRecord[]> {
    if (projectIds.length === 0) return []

    const rows = await this.db
      .with('latest', (db) =>
        db
          .selectFrom('DefiTvl')
          .select('projectId')
          .select((eb) => eb.fn.max('timestamp').as('timestamp'))
          .where('projectId', 'in', projectIds)
          .groupBy('projectId'),
      )
      .selectFrom('DefiTvl as d')
      .innerJoin('latest as l', (join) =>
        join
          .onRef('d.projectId', '=', 'l.projectId')
          .onRef('d.timestamp', '=', 'l.timestamp'),
      )
      .select((eb) => [
        'd.projectId',
        'd.timestamp',
        eb.fn.min('d.sourceTimestamp').as('sourceTimestamp'),
        eb.cast(eb.fn.sum('d.valueUsd'), 'double precision').as('valueUsd'),
        eb.fn.count('d.chain').as('chainCount'),
      ])
      .groupBy(['d.projectId', 'd.timestamp'])
      .execute()

    return rows.map(toSummedRecord)
  }

  async getByProjectInRange(
    projectId: string,
    fromInclusive: UnixTime | null,
    toInclusive: UnixTime,
  ): Promise<SummedDefiTvlRecord[]> {
    let query = this.db
      .selectFrom('DefiTvl')
      .select((eb) => [
        'projectId',
        'timestamp',
        eb.fn.min('sourceTimestamp').as('sourceTimestamp'),
        eb.cast(eb.fn.sum('valueUsd'), 'double precision').as('valueUsd'),
        eb.fn.count('chain').as('chainCount'),
      ])
      .where('projectId', '=', projectId)
      .where('timestamp', '<=', UnixTime.toDate(toInclusive))
      .groupBy(['projectId', 'timestamp'])
      .orderBy('timestamp', 'asc')

    if (fromInclusive !== null) {
      query = query.where('timestamp', '>=', UnixTime.toDate(fromInclusive))
    }

    const rows = await query.execute()
    return rows.map(toSummedRecord)
  }

  async deleteByConfigIds(ids: string[]): Promise<number> {
    if (ids.length === 0) return 0

    const result = await this.db
      .deleteFrom('DefiTvl')
      .where('configurationId', 'in', ids)
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getAll(): Promise<DefiTvlRecord[]> {
    const rows = await this.db.selectFrom('DefiTvl').selectAll().execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('DefiTvl').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}

function toSummedRecord(row: {
  projectId: string
  timestamp: Date
  sourceTimestamp: Date
  valueUsd: unknown
  chainCount: unknown
}): SummedDefiTvlRecord {
  return {
    projectId: row.projectId,
    timestamp: UnixTime.fromDate(row.timestamp),
    sourceTimestamp: UnixTime.fromDate(row.sourceTimestamp),
    valueUsd: Number(row.valueUsd),
    chainCount: Number(row.chainCount),
  }
}
