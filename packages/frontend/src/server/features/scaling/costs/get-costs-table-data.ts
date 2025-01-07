import { type Layer2, type Layer3 } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getCostsForProjects } from './get-costs-for-projects'
import { type LatestCostsProjectResponse } from './types'
import { getCostsProjects } from './utils/get-costs-projects'
import { type CostsTimeRange, getFullySyncedCostsRange } from './utils/range'

export function getCostsTable(
  ...parameters: Parameters<typeof getCachedCostsTableData>
) {
  if (env.MOCK) {
    return getMockCostsTableData()
  }
  return getCachedCostsTableData(...parameters)
}

export type CostsTableData = Awaited<ReturnType<typeof getCachedCostsTableData>>

export const getCachedCostsTableData = cache(
  async (timeRange: CostsTimeRange) => {
    const projects = getCostsProjects()
    const projectsCosts = await getCostsForProjects(projects, timeRange)
    const projectsActivity = await getLatestActivityForProjects(
      projects,
      timeRange,
    )

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
  ['costs-table-data'],
  {
    tags: ['costs'],
  },
)

async function getLatestActivityForProjects(
  projects: (Layer2 | Layer3)[],
  timeRange: CostsTimeRange,
) {
  const db = getDb()
  const range = getFullySyncedCostsRange(timeRange)
  const summedCounts = await db.activity.getSummedCountForProjectsAndTimeRange(
    projects.map((p) => p.id),
    range,
  )

  return Object.fromEntries(
    summedCounts.map((record) => [record.projectId, record.count]),
  )
}

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

function getMockCostsTableData(): CostsTableData {
  const projects = getCostsProjects()

  return Object.fromEntries(
    projects.map((p) => {
      return [
        p.id,
        {
          syncStatus: getSyncStatus(UnixTime.now()),
          txCount: 1500,
          gas: {
            total: 1000000,
            overhead: 100000,
            calldata: 300000,
            compute: 200000,
            blobs: 400000,
          },
          eth: {
            total: 10000,
            overhead: 2000,
            calldata: 3000,
            compute: 4000,
            blobs: 1000,
          },
          usd: {
            total: 100000,
            overhead: 20000,
            calldata: 30000,
            compute: 40000,
            blobs: 10000,
          },
        },
      ]
    }),
  )
}
