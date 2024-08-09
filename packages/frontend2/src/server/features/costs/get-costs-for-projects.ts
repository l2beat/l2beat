import { type Layer2 } from '@l2beat/config'
import {
  type AggregatedL2CostRecord,
  type IndexerConfigurationRecord,
} from '@l2beat/database'
import { notUndefined } from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import { db } from '~/server/database'
import {
  type LatestCostsProjectResponse,
  type LatestCostsResponse,
} from './types'
import { addIfDefined } from './utils/add-if-defined'
import { getSyncedUntil } from './utils/get-synced-until'
import { type CostsTimeRange, getFullySyncedCostsRange } from './utils/range'
import { toTrackedTxConfig } from './utils/to-tracked-tx-config'

export async function getCostsForProjects(
  projects: Layer2[],
  timeRange: CostsTimeRange,
) {
  const response: LatestCostsResponse = {}
  const range = getFullySyncedCostsRange(timeRange)

  const configurations = await db.indexerConfiguration.getByIndexerId(
    'tracked_txs_indexer',
  )

  const projectsWithSyncedUntil = filteredWithSyncedUntil(
    projects,
    configurations,
  )

  const records = await db.aggregatedL2Cost.getByProjectsAndTimeRange(
    projectsWithSyncedUntil.map((p) => p.id),
    range,
  )

  const groupedRecords = groupBy(records, 'projectId')

  for (const project of projectsWithSyncedUntil) {
    const records = groupedRecords[project.id]
    if (records === undefined) continue
    response[project.id] = {
      ...sumValues(records),
      syncedUntil: project.syncedUntil,
    }
  }
  return response
}

function filteredWithSyncedUntil(
  projects: Layer2[],
  configurations: IndexerConfigurationRecord[],
) {
  return projects
    .map((project) => {
      const trackedTxConfig = toTrackedTxConfig(
        project.id,
        project.config.trackedTxs,
      )
      if (trackedTxConfig === undefined) return

      const projectRuntimeConfigIds = trackedTxConfig
        .filter((c) => c.type === 'l2costs')
        .map((c) => c.id)

      const projectConfigs = configurations.filter((c) =>
        projectRuntimeConfigIds.includes(c.id),
      )

      if (projectConfigs.length === 0) return

      const syncedUntil = getSyncedUntil(projectConfigs)
      if (!syncedUntil) return

      return {
        ...project,
        syncedUntil,
      }
    })
    .filter(notUndefined)
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
