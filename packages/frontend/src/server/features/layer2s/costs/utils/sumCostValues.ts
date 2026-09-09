import type { AggregatedL2CostRecord } from '@l2beat/database'
import type { LatestCostsProjectResponse } from '../types'
import { addIfDefined } from './addIfDefined'

export function sumCostValues(
  records: Omit<
    AggregatedL2CostRecord,
    'timestamp' | 'projectId' | `total${string}`
  >[],
): Omit<LatestCostsProjectResponse, 'syncedUntil' | 'range'> {
  return records.reduce<
    Omit<LatestCostsProjectResponse, 'syncedUntil' | 'range'>
  >(
    (acc, record) => {
      return {
        gas: {
          overhead: acc.gas.overhead + record.overheadGas,
          calldata: acc.gas.calldata + record.calldataGas,
          compute: acc.gas.compute + record.computeGas,
          blobs: addIfDefined(acc.gas.blobs, record.blobsGas),
        },
        eth: {
          overhead: acc.eth.overhead + record.overheadGasEth,
          calldata: acc.eth.calldata + record.calldataGasEth,
          compute: acc.eth.compute + record.computeGasEth,
          blobs: addIfDefined(acc.eth.blobs, record.blobsGasEth),
        },
        usd: {
          overhead: acc.usd.overhead + record.overheadGasUsd,
          calldata: acc.usd.calldata + record.calldataGasUsd,
          compute: acc.usd.compute + record.computeGasUsd,
          blobs: addIfDefined(acc.usd.blobs, record.blobsGasUsd),
        },
      }
    },
    {
      gas: {
        overhead: 0,
        calldata: 0,
        compute: 0,
        blobs: null,
      },
      eth: {
        overhead: 0,
        calldata: 0,
        compute: 0,
        blobs: null,
      },
      usd: {
        overhead: 0,
        calldata: 0,
        compute: 0,
        blobs: null,
      },
    },
  )
}
