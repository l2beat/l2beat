import {
  type ProjectId,
  type ProjectValueType,
  UnixTime,
} from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { ProjectValue } from '../kysely/generated/types'

export interface ProjectValueRecord {
  timestamp: UnixTime
  project: string
  type: ProjectValueType
  value: number
  canonical: number
  external: number
  native: number
  ether: number
  stablecoin: number
  btc: number
  rwaRestricted: number
  rwaPublic: number
  other: number
  associated: number
}

export function toRecord(row: Selectable<ProjectValue>): ProjectValueRecord {
  return {
    ...row,
    type: row.type as ProjectValueType,
    timestamp: UnixTime.fromDate(row.timestamp),
  }
}

export function toRow(record: ProjectValueRecord): Insertable<ProjectValue> {
  return {
    ...record,
    timestamp: UnixTime.toDate(record.timestamp),
  }
}

export type SummedByTimestampProjectValueRecord = Omit<
  ProjectValueRecord,
  'project' | 'type'
>

export function toSummedByTimestampRecord(
  row: Selectable<Omit<ProjectValue, 'project' | 'type'>>,
): SummedByTimestampProjectValueRecord {
  return {
    ...row,
    timestamp: UnixTime.fromDate(row.timestamp),
  }
}

export class ProjectValueRepository extends BaseRepository {
  async upsertMany(records: ProjectValueRecord[]) {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('ProjectValue')
        .values(batch)
        .onConflict((cb) =>
          cb.columns(['timestamp', 'project', 'type']).doUpdateSet((eb) => ({
            value: eb.ref('excluded.value'),
            canonical: eb.ref('excluded.canonical'),
            external: eb.ref('excluded.external'),
            native: eb.ref('excluded.native'),
            ether: eb.ref('excluded.ether'),
            stablecoin: eb.ref('excluded.stablecoin'),
            btc: eb.ref('excluded.btc'),
            rwaRestricted: eb.ref('excluded.rwaRestricted'),
            rwaPublic: eb.ref('excluded.rwaPublic'),
            other: eb.ref('excluded.other'),
            associated: eb.ref('excluded.associated'),
          })),
        )
        .execute()
    })

    return records.length
  }

  async trimProject(
    project: string,
    sinceTimestamp: number,
    untilTimestamp: number | null,
  ): Promise<number> {
    let query = this.db
      .deleteFrom('ProjectValue')
      .where('project', '=', project)

    if (untilTimestamp === null) {
      query = query.where('timestamp', '<', UnixTime.toDate(sinceTimestamp))
    } else {
      query = query.where((qb) =>
        qb.or([
          qb('timestamp', '<', UnixTime.toDate(sinceTimestamp)),
          qb('timestamp', '>', UnixTime.toDate(untilTimestamp)),
        ]),
      )
    }

    const result = await query.executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getAll(): Promise<ProjectValueRecord[]> {
    const rows = await this.db.selectFrom('ProjectValue').selectAll().execute()
    return rows.map(toRecord)
  }

  async getSummedByTimestamp(
    projects: ProjectId[],
    type: ProjectValueType,
    range: [number | null, number],
  ) {
    const [from, to] = range
    let query = this.db
      .selectFrom('ProjectValue')
      .select((eb) => [
        'timestamp',
        eb.fn
          .sum<number>((qb) => qb.cast('value', 'double precision'))
          .as('value'),
        eb.fn
          .sum<number>((qb) => qb.cast('canonical', 'double precision'))
          .as('canonical'),
        eb.fn
          .sum<number>((qb) => qb.cast('external', 'double precision'))
          .as('external'),
        eb.fn
          .sum<number>((qb) => qb.cast('native', 'double precision'))
          .as('native'),
        eb.fn
          .sum<number>((qb) => qb.cast('ether', 'double precision'))
          .as('ether'),
        eb.fn
          .sum<number>((qb) => qb.cast('stablecoin', 'double precision'))
          .as('stablecoin'),
        eb.fn
          .sum<number>((qb) => qb.cast('other', 'double precision'))
          .as('other'),
        eb.fn
          .sum<number>((qb) => qb.cast('associated', 'double precision'))
          .as('associated'),
        eb.fn.sum<number>((qb) => qb.cast('btc', 'double precision')).as('btc'),
        eb.fn
          .sum<number>((qb) => qb.cast('rwaRestricted', 'double precision'))
          .as('rwaRestricted'),
        eb.fn
          .sum<number>((qb) => qb.cast('rwaPublic', 'double precision'))
          .as('rwaPublic'),
      ])
      .where('type', '=', type)
      .where('project', 'in', projects)
      .where('timestamp', '<=', UnixTime.toDate(to))
      .groupBy('timestamp')
      .orderBy('timestamp', 'asc')

    if (from !== null) {
      query = query.where('timestamp', '>=', UnixTime.toDate(from))
    }

    const rows = await query.execute()

    return rows.map(toSummedByTimestampRecord)
  }

  async getLatestValues(
    type: ProjectValueType,
    projectIds?: ProjectId[],
  ): Promise<ProjectValueRecord[]> {
    let subQuery = this.db
      .selectFrom('ProjectValue')
      .select(['project', this.db.fn.max('timestamp').as('maxTimestamp')])
      .where('type', '=', type)

    if (projectIds) {
      subQuery = subQuery.where('project', 'in', projectIds)
    }

    subQuery = subQuery.groupBy('project')

    const rows = await this.db
      .selectFrom('ProjectValue as pv')
      .innerJoin(subQuery.as('latest'), (join) =>
        join
          .onRef('pv.project', '=', 'latest.project')
          .onRef('pv.timestamp', '=', 'latest.maxTimestamp'),
      )
      .where('pv.type', '=', type)
      .selectAll('pv')
      .execute()

    return rows.map(toRecord)
  }

  async getProjectValuesAtTimestamps(
    oldestTimestamp: number,
    latestTimestamp: number,
    types: ProjectValueType[],
    projectIds?: string[],
    cutOffTimestamp?: number,
  ): Promise<ProjectValueRecord[]> {
    if (types.length === 0) {
      return []
    }

    // Find latest records for each project/type combo before or at given timestamp
    const subQuery = (timestamp: number) => {
      let query = this.db
        .selectFrom('ProjectValue')
        .select([
          'project',
          'type',
          this.db.fn.max('timestamp').as('maxTimestamp'),
        ])
        .where('type', 'in', types)

      if (projectIds && projectIds.length > 0) {
        query = query.where('project', 'in', projectIds)
      }

      query = query
        // We dont need to query whole database, we can limit it to 30 days
        .where(
          'timestamp',
          '>=',
          cutOffTimestamp
            ? UnixTime.toDate(cutOffTimestamp)
            : sql<Date>`NOW() - INTERVAL '30 days'`,
        )
        .where('timestamp', '<=', UnixTime.toDate(timestamp))
        .groupBy(['project', 'type'])
      return query
    }

    const rows = await this.db
      .selectFrom('ProjectValue as pv')
      .innerJoin(subQuery(latestTimestamp).as('latest'), (join) =>
        join
          .onRef('pv.project', '=', 'latest.project')
          .onRef('pv.type', '=', 'latest.type')
          .onRef('pv.timestamp', '=', 'latest.maxTimestamp'),
      )
      .selectAll('pv')
      .unionAll((qb) =>
        qb
          .selectFrom('ProjectValue as pv')
          .innerJoin(subQuery(oldestTimestamp).as('oldest'), (join) =>
            join
              .onRef('pv.project', '=', 'oldest.project')
              .onRef('pv.type', '=', 'oldest.type')
              .onRef('pv.timestamp', '=', 'oldest.maxTimestamp'),
          )
          .selectAll('pv'),
      )
      .orderBy('timestamp')
      .execute()

    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('ProjectValue').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
