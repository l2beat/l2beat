import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { AggregatedL2Cost } from '../../kysely/generated/types'

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
    timestamp: record.timestamp.toDate(),
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
