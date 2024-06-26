import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { Insertable, Selectable } from 'kysely'
import { AggregatedL2Cost as AggregatedL2CostRow } from '../kysely/generated/types'

export interface AggregatedL2Cost {
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
  record: AggregatedL2Cost,
): Insertable<AggregatedL2CostRow> {
  return {
    timestamp: record.timestamp.toDate(),
    project_id: record.projectId.toString(),
    total_gas: record.totalGas,
    total_gas_eth: record.totalGasEth,
    total_gas_usd: record.totalGasUsd,
    blobs_gas: record.blobsGas,
    blobs_gas_eth: record.blobsGasEth,
    blobs_gas_usd: record.blobsGasUsd,
    calldata_gas: record.calldataGas,
    calldata_gas_eth: record.calldataGasEth,
    calldata_gas_usd: record.calldataGasUsd,
    compute_gas: record.computeGas,
    compute_gas_eth: record.computeGasEth,
    compute_gas_usd: record.computeGasUsd,
    overhead_gas: record.overheadGas,
    overhead_gas_eth: record.overheadGasEth,
    overhead_gas_usd: record.overheadGasUsd,
  }
}

export function toRecord(
  row: Selectable<AggregatedL2CostRow>,
): AggregatedL2Cost {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    projectId: ProjectId(row.project_id),
    totalGas: row.total_gas,
    totalGasEth: row.total_gas_eth,
    totalGasUsd: row.total_gas_usd,
    blobsGas: row.blobs_gas,
    blobsGasEth: row.blobs_gas_eth,
    blobsGasUsd: row.blobs_gas_usd,
    calldataGas: row.calldata_gas,
    calldataGasEth: row.calldata_gas_eth,
    calldataGasUsd: row.calldata_gas_usd,
    computeGas: row.compute_gas,
    computeGasEth: row.compute_gas_eth,
    computeGasUsd: row.compute_gas_usd,
    overheadGas: row.overhead_gas,
    overheadGasEth: row.overhead_gas_eth,
    overheadGasUsd: row.overhead_gas_usd,
  }
}
