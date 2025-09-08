import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
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
}
