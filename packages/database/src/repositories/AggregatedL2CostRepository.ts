import {
  assert,
  ProjectId,
  UnixTime,
  type UnixTimePeriod,
} from '@l2beat/shared-pure'
import { type Insertable, type Selectable, sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { AggregatedL2Cost } from '../kysely/generated/types'

export interface AggregatedL2CostRecord {
  timestamp: UnixTime
  projectId: ProjectId
  totalGas: number
  totalGasEth: number
  totalGasUsd: number
  blobsGas: number | null
  blobsGasEth: number | null
  blobsGasUsd: number | null
  calldataGas: number
  calldataGasEth: number
  calldataGasUsd: number
  computeGas: number
  computeGasEth: number
  computeGasUsd: number
  overheadGas: number
  overheadGasEth: number
  overheadGasUsd: number
}

export interface SummedL2CostRecord {
  timestamp: UnixTime
  lastTimestamp: UnixTime
  blobsGas: number | null
  blobsGasEth: number | null
  blobsGasUsd: number | null
  calldataGas: number
  calldataGasEth: number
  calldataGasUsd: number
  computeGas: number
  computeGasEth: number
  computeGasUsd: number
  overheadGas: number
  overheadGasEth: number
  overheadGasUsd: number
}

const BUCKET_INTERVALS: Record<UnixTimePeriod, string> = {
  minute: '1 minute',
  hour: '1 hour',
  'six hours': '6 hours',
  day: '1 day',
}

export function toRow(
  record: AggregatedL2CostRecord,
): Insertable<AggregatedL2Cost> {
  return {
    ...record,
    timestamp: UnixTime.toDate(record.timestamp),
    projectId: record.projectId.toString(),
  }
}

export function toRecord(
  row: Selectable<AggregatedL2Cost>,
): AggregatedL2CostRecord {
  return {
    ...row,
    timestamp: UnixTime.fromDate(row.timestamp),
    projectId: ProjectId(row.projectId),
  }
}

export class AggregatedL2CostRepository extends BaseRepository {
  async getAll(): Promise<AggregatedL2CostRecord[]> {
    const rows = await this.db
      .selectFrom('AggregatedL2Cost')
      .selectAll()
      .execute()
    return rows.map(toRecord)
  }

  async upsertMany(records: AggregatedL2CostRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 5_000, async (batch) => {
      await this.db
        .insertInto('AggregatedL2Cost')
        .values(batch)
        .onConflict((cb) =>
          cb.columns(['timestamp', 'projectId']).doUpdateSet((eb) => ({
            totalGas: eb.ref('excluded.totalGas'),
            totalGasEth: eb.ref('excluded.totalGasEth'),
            totalGasUsd: eb.ref('excluded.totalGasUsd'),
            blobsGas: eb.ref('excluded.blobsGas'),
            blobsGasEth: eb.ref('excluded.blobsGasEth'),
            blobsGasUsd: eb.ref('excluded.blobsGasUsd'),
            calldataGas: eb.ref('excluded.calldataGas'),
            calldataGasEth: eb.ref('excluded.calldataGasEth'),
            calldataGasUsd: eb.ref('excluded.calldataGasUsd'),
            computeGas: eb.ref('excluded.computeGas'),
            computeGasEth: eb.ref('excluded.computeGasEth'),
            computeGasUsd: eb.ref('excluded.computeGasUsd'),
            overheadGas: eb.ref('excluded.overheadGas'),
            overheadGasEth: eb.ref('excluded.overheadGasEth'),
            overheadGasUsd: eb.ref('excluded.overheadGasUsd'),
          })),
        )
        .execute()
    })
    return records.length
  }

  async deleteAfter(from: UnixTime): Promise<number> {
    const result = await this.db
      .deleteFrom('AggregatedL2Cost')
      .where('timestamp', '>', UnixTime.toDate(from))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('AggregatedL2Cost')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async checkIfExists(
    projectId: ProjectId,
    fromInclusive?: UnixTime,
  ): Promise<boolean> {
    let query = this.db
      .selectFrom('AggregatedL2Cost')
      .select('projectId')
      .where('projectId', '=', projectId.toString())
      .limit(1)

    if (fromInclusive !== undefined) {
      query = query.where('timestamp', '>=', UnixTime.toDate(fromInclusive))
    }

    const result = await query.executeTakeFirst()
    return result !== undefined
  }

  async getByProjectAndTimeRange(
    projectId: ProjectId,
    timeRange: [UnixTime | null, UnixTime],
  ): Promise<AggregatedL2CostRecord[]> {
    const [from, to] = timeRange
    let query = this.db
      .selectFrom('AggregatedL2Cost')
      .selectAll()
      .where('projectId', '=', projectId.toString())

    if (from !== null) {
      query = query.where('timestamp', '>=', UnixTime.toDate(from))
    }

    query = query
      .where('timestamp', '<', UnixTime.toDate(to))
      .orderBy('timestamp', 'asc')

    const rows = await query.execute()
    return rows.map(toRecord)
  }

  async getByProjectsAndTimeRange(
    projectIds: ProjectId[],
    timeRange: [UnixTime | null, UnixTime],
  ): Promise<AggregatedL2CostRecord[]> {
    if (projectIds.length === 0) return []
    const [from, to] = timeRange
    let query = this.db
      .selectFrom('AggregatedL2Cost')
      .selectAll()
      .where(
        'projectId',
        'in',
        projectIds.map((p) => p.toString()),
      )
      .where('timestamp', '<', UnixTime.toDate(to))
      .orderBy('timestamp', 'asc')

    if (from !== null) {
      query = query.where('timestamp', '>=', UnixTime.toDate(from))
    }

    const rows = await query.execute()
    return rows.map(toRecord)
  }

  async getSummedByProjectsAndTimeRange(
    projectIds: ProjectId[],
    timeRange: [UnixTime | null, UnixTime],
    resolution: UnixTimePeriod,
  ): Promise<SummedL2CostRecord[]> {
    if (projectIds.length === 0) return []
    const [from, to] = timeRange
    const bucket = sql<Date>`date_bin(${sql.lit(BUCKET_INTERVALS[resolution])}::interval, "timestamp", timestamp '1970-01-01')`
    let query = this.db
      .selectFrom('AggregatedL2Cost')
      .select((eb) => [
        bucket.as('timestamp'),
        eb.fn.max('timestamp').as('lastTimestamp'),
        sumAsDouble('blobsGas').as('blobsGas'),
        sumAsDouble('blobsGasEth').as('blobsGasEth'),
        sumAsDouble('blobsGasUsd').as('blobsGasUsd'),
        sumAsDouble('calldataGas').as('calldataGas'),
        sumAsDouble('calldataGasEth').as('calldataGasEth'),
        sumAsDouble('calldataGasUsd').as('calldataGasUsd'),
        sumAsDouble('computeGas').as('computeGas'),
        sumAsDouble('computeGasEth').as('computeGasEth'),
        sumAsDouble('computeGasUsd').as('computeGasUsd'),
        sumAsDouble('overheadGas').as('overheadGas'),
        sumAsDouble('overheadGasEth').as('overheadGasEth'),
        sumAsDouble('overheadGasUsd').as('overheadGasUsd'),
      ])
      .where(
        'projectId',
        'in',
        projectIds.map((p) => p.toString()),
      )
      .where('timestamp', '<', UnixTime.toDate(to))
      .groupBy(bucket)
      .orderBy(bucket, 'asc')

    if (from !== null) {
      query = query.where('timestamp', '>=', UnixTime.toDate(from))
    }

    const rows = await query.execute()
    return rows.map((row) => ({
      ...row,
      timestamp: UnixTime.fromDate(row.timestamp),
      lastTimestamp: UnixTime.fromDate(row.lastTimestamp),
      calldataGas: notNull(row.calldataGas),
      calldataGasEth: notNull(row.calldataGasEth),
      calldataGasUsd: notNull(row.calldataGasUsd),
      computeGas: notNull(row.computeGas),
      computeGasEth: notNull(row.computeGasEth),
      computeGasUsd: notNull(row.computeGasUsd),
      overheadGas: notNull(row.overheadGas),
      overheadGasEth: notNull(row.overheadGasEth),
      overheadGasUsd: notNull(row.overheadGasUsd),
    }))
  }

  async getFirstTimestampByProjects(
    projectIds: ProjectId[],
  ): Promise<UnixTime | undefined> {
    if (projectIds.length === 0) return undefined
    const row = await this.db
      .selectFrom('AggregatedL2Cost')
      .select((eb) => eb.fn.min('timestamp').as('timestamp'))
      .where(
        'projectId',
        'in',
        projectIds.map((p) => p.toString()),
      )
      .executeTakeFirst()

    return row?.timestamp ? UnixTime.fromDate(row.timestamp) : undefined
  }
}

type SummableColumn = Exclude<
  keyof SummedL2CostRecord,
  'timestamp' | 'lastTimestamp'
>

function sumAsDouble(column: SummableColumn) {
  return sql<number | null>`sum(${sql.ref(column)}::double precision)`
}

function notNull(value: number | null): number {
  assert(value !== null, 'Sum of a non-nullable column is null')
  return value
}
