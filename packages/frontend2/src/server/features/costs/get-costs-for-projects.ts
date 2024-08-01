import { type Layer2 } from '@l2beat/config/src'
import { type AggregatedL2CostRecord } from '@l2beat/database'
import { db } from '~/server/database'
import { getRange } from '~/utils/range/range'
import {
  type LatestCostsProjectResponse,
  type LatestCostsResponse,
} from './types'
import { addIfNotNull } from './utils/add-if-not-null'
import { getSyncedUntil } from './utils/get-synced-until'
import { type CostsTimeRange, rangeToResolution } from './utils/range'
import { toTrackedTxConfig } from './utils/to-tracked-tx-config'

export async function getCostsForProjects(
  projects: Layer2[],
  timeRange: CostsTimeRange,
) {
  const resolution = rangeToResolution(timeRange)
  const configurations = await db.indexerConfiguration.getByIndexerId(
    'tracked_txs_indexer',
  )
  const response: LatestCostsResponse = {}
  for (const project of projects) {
    const trackedTxConfig = toTrackedTxConfig(
      project.id,
      project.config.trackedTxs,
    )
    if (trackedTxConfig === undefined) continue

    const projectRuntimeConfigIds = trackedTxConfig
      .filter((c) => c.type === 'l2costs')
      .map((c) => c.id)

    const projectConfigs = configurations.filter((c) =>
      projectRuntimeConfigIds.includes(c.id),
    )

    if (projectConfigs.length === 0) continue

    const syncedUntil = getSyncedUntil(projectConfigs)
    if (!syncedUntil) {
      continue
    }

    const range = getRange(timeRange, resolution)
    const records = await db.aggregatedL2Cost.getByProjectAndTimeRange(
      project.id,
      range,
    )

    response[project.id] = {
      ...sumValues(records),
      syncedUntil,
    }
  }

  return response
}

function sumValues(
  records: AggregatedL2CostRecord[],
): Omit<LatestCostsProjectResponse, 'syncedUntil'> {
  return records.reduce<Omit<LatestCostsProjectResponse, 'syncedUntil'>>(
    (acc, record) => {
      return {
        gas: {
          overhead: acc.gas.overhead + record.overheadGas,
          calldata: acc.gas.calldata + record.calldataGas,
          compute: acc.gas.compute + record.computeGas,
          blobs: addIfNotNull(acc.gas.blobs, record.blobsGas),
        },
        eth: {
          overhead: acc.eth.overhead + record.overheadGasEth,
          calldata: acc.eth.calldata + record.calldataGasEth,
          compute: acc.eth.compute + record.computeGasEth,
          blobs: addIfNotNull(acc.eth.blobs, record.blobsGasEth),
        },
        usd: {
          overhead: acc.usd.overhead + record.overheadGasUsd,
          calldata: acc.usd.calldata + record.calldataGasUsd,
          compute: acc.usd.compute + record.computeGasUsd,
          blobs: addIfNotNull(acc.usd.blobs, record.blobsGasUsd),
        },
      }
    },
    {
      gas: {
        overhead: 0,
        calldata: 0,
        compute: 0,
        blobs: undefined,
      },
      eth: {
        overhead: 0,
        calldata: 0,
        compute: 0,
        blobs: undefined,
      },
      usd: {
        overhead: 0,
        calldata: 0,
        compute: 0,
        blobs: undefined,
      },
    },
  )
}
