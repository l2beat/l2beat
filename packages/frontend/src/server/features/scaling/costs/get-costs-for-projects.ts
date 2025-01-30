import type { Layer2 } from '@l2beat/config'
import type { AggregatedL2CostRecord } from '@l2beat/database'
import { groupBy } from 'lodash'
import { getDb } from '~/server/database'
import { getTrackedTxsProjects } from '../../utils/get-tracked-txs-projects'
import type { LatestCostsProjectResponse, LatestCostsResponse } from './types'
import { addIfDefined } from './utils/add-if-defined'
import type { CostsTimeRange } from './utils/range'
import { getFullySyncedCostsRange } from './utils/range'

export async function getCostsForProjects(
  projects: Layer2[],
  timeRange: CostsTimeRange,
) {
  const db = getDb()
  const response: LatestCostsResponse = {}
  const range = getFullySyncedCostsRange(timeRange)

  const configurations = await db.indexerConfiguration.getByIndexerId(
    'tracked_txs_indexer',
  )

  const trackedTxsProjects = getTrackedTxsProjects(
    projects,
    configurations,
    'l2costs',
  )

  const records = await db.aggregatedL2Cost.getByProjectsAndTimeRange(
    trackedTxsProjects.map((p) => p.id),
    range,
  )

  const groupedRecords = groupBy(records, 'projectId')

  for (const project of trackedTxsProjects) {
    const records = groupedRecords[project.id]
    if (records === undefined) continue
    response[project.id] = {
      ...sumValues(records),
      syncedUntil: project.syncedUntil,
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
