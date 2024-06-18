// import { Insertable, Selectable } from 'kysely'
// import { AggregatedL2Costs as AggregatedL2CostsEntity } from '../kysely/generated/types'

// // TODO: resolve at-least unique issue
// export interface AggregatedL2Costs {
//   timestamp: Date
//   projectId: string
//   totalGas: number
//   totalGasEth: number
//   totalGasUsd: number
//   blobsGas?: number
//   blobsGasEth?: number
//   blobsGasUsd?: number
//   calldataGas: number
//   calldataGasEth: number
//   calldataGasUsd: number
//   computeGas: number
//   computeGasEth: number
//   computeGasUsd: number
//   overheadGasEth: number
//   overheadGasUsd: number
//   overheadGas: number
// }

// export function fromEntity(
//   entity: Selectable<AggregatedL2CostsEntity>,
// ): AggregatedL2Costs {
//   return {
//     timestamp: entity.timestamp,
//     projectId: entity.project_id,
//     totalGas: entity.total_gas,
//     totalGasEth: entity.total_gas_eth,
//     totalGasUsd: entity.total_gas_usd,
//     blobsGas: entity.blobs_gas ?? undefined,
//     blobsGasEth: entity.blobs_gas_eth ?? undefined,
//     blobsGasUsd: entity.blobs_gas_usd ?? undefined,
//     calldataGas: entity.calldata_gas,
//     calldataGasEth: entity.calldata_gas_eth,
//     calldataGasUsd: entity.calldata_gas_usd,
//     computeGas: entity.compute_gas,
//     computeGasEth: entity.compute_gas_eth,
//     computeGasUsd: entity.compute_gas_usd,
//     overheadGasEth: entity.overhead_gas_eth,
//     overheadGasUsd: entity.overhead_gas_usd,
//     overheadGas: entity.overhead_gas,
//   }
// }

// export function toEntity(
//   aggregatedL2Costs: AggregatedL2Costs,
// ): Insertable<AggregatedL2CostsEntity> {
//   return {
//     timestamp: aggregatedL2Costs.timestamp,
//     project_id: aggregatedL2Costs.projectId,
//     total_gas: aggregatedL2Costs.totalGas,
//     total_gas_eth: aggregatedL2Costs.totalGasEth,
//     total_gas_usd: aggregatedL2Costs.totalGasUsd,
//     blobs_gas: aggregatedL2Costs.blobsGas,
//     blobs_gas_eth: aggregatedL2Costs.blobsGasEth,
//     blobs_gas_usd: aggregatedL2Costs.blobsGasUsd,
//     calldata_gas: aggregatedL2Costs.calldataGas,
//     calldata_gas_eth: aggregatedL2Costs.calldataGasEth,
//     calldata_gas_usd: aggregatedL2Costs.calldataGasUsd,
//     compute_gas: aggregatedL2Costs.computeGas,
//     compute_gas_eth: aggregatedL2Costs.computeGasEth,
//     compute_gas_usd: aggregatedL2Costs.computeGasUsd,
//     overhead_gas_eth: aggregatedL2Costs.overheadGasEth,
//     overhead_gas_usd: aggregatedL2Costs.overheadGasUsd,
//     overhead_gas: aggregatedL2Costs.overheadGas,
//   }
// }
