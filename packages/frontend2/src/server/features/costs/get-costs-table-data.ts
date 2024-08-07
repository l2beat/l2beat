import { UnixTime } from '@l2beat/shared-pure'
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from 'next/cache'
import { type SyncStatus } from '~/types/SyncStatus'
import { getLatestActivityForProjects } from '../activity/get-activity-for-projects'
import { type CostsUnit } from '../scaling/get-scaling-costs-entries'
import { getCostsForProjects } from './get-costs-for-projects'
import { type LatestCostsProjectResponse } from './types'
import { getCostsProjects } from './utils/get-costs-projects'
import { type CostsTimeRange } from './utils/range'

interface CostsValues {
  total: number
  calldata: number
  blobs: number | undefined
  compute: number
  overhead: number
}

export type CostsTableData = Record<CostsUnit, CostsValues> & {
  txCount: number | undefined
  syncStatus: SyncStatus
}

export function getCostsTableData(
  ...parameters: Parameters<typeof getCachedCostsTableData>
) {
  noStore()
  return getCachedCostsTableData(...parameters)
}

const getCachedCostsTableData = cache(
  async (
    timeRange: CostsTimeRange,
  ): Promise<Record<string, CostsTableData>> => {
    const projects = getCostsProjects()
    console.time('[getCostsTableData] getCostsForProjects')
    const projectsCosts = await getCostsForProjects(projects, timeRange)
    console.timeEnd('[getCostsTableData] getCostsForProjects')

    console.time('[getCostsTableData] getLatestActivityForProjects')
    const projectsActivity = await getLatestActivityForProjects(
      projects,
      timeRange,
    )
    console.timeEnd('[getCostsTableData] getLatestActivityForProjects')
    return Object.fromEntries(
      Object.entries(projectsCosts).map(([projectId, costs]) => {
        return [
          projectId,
          {
            ...withTotal(costs),
            syncStatus: getSyncStatus(costs.syncedUntil),
            txCount: projectsActivity[projectId],
          },
        ]
      }),
    )
  },
  ['costsTable'],
  { revalidate: 60 * 10 },
)

function getSyncStatus(syncedUntil: UnixTime) {
  const isSynced = UnixTime.now()
    .add(-1, 'days')
    .add(-1, 'hours')
    .lte(syncedUntil)

  return { isSynced, syncedUntil: syncedUntil.toNumber() }
}

function withTotal(data: LatestCostsProjectResponse) {
  return {
    gas: {
      ...data.gas,
      total:
        data.gas.overhead +
        data.gas.calldata +
        data.gas.compute +
        (data.gas.blobs ?? 0),
    },
    eth: {
      ...data.eth,
      total:
        data.eth.overhead +
        data.eth.calldata +
        data.eth.compute +
        (data.eth.blobs ?? 0),
    },
    usd: {
      ...data.usd,
      total:
        data.usd.overhead +
        data.usd.calldata +
        data.usd.compute +
        (data.usd.blobs ?? 0),
    },
  }
}
