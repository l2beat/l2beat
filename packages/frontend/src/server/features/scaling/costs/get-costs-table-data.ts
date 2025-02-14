import type { Layer2, Layer3 } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getCostsForProjects } from './get-costs-for-projects'
import type { LatestCostsProjectResponse } from './types'
import { getCostsProjects } from './utils/get-costs-projects'
import { isCostsSynced } from './utils/is-costs-synced'
import type { CostsTimeRange } from './utils/range'
import { getFullySyncedCostsRange } from './utils/range'

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
    const projects = getCostsProjects().filter((p) => !p.isArchived)
    const projectsCosts = await getCostsForProjects(projects, timeRange)
    const projectsActivity = await getLatestActivityForProjects(
      projects,
      timeRange,
    )

    return Object.fromEntries(
      Object.entries(projectsCosts).map(([projectId, costs]) => {
        const isSynced = isCostsSynced(costs.syncedUntil)
        return [
          projectId,
          {
            ...withTotal(costs),
            uopsCount: projectsActivity[projectId],
            isSynced,
          },
        ]
      }),
    )
  },
  ['costs-table-data'],
  {
    tags: ['hourly-data'],
    revalidate: UnixTime.HOUR,
  },
)

async function getLatestActivityForProjects(
  projects: (Layer2 | Layer3)[],
  timeRange: CostsTimeRange,
) {
  const db = getDb()
  const range = getFullySyncedCostsRange(timeRange)
  const summedCounts =
    await db.activity.getSummedUopsCountForProjectsAndTimeRange(
      projects.map((p) => p.id),
      range,
    )

  return Object.fromEntries(
    summedCounts.map((record) => [record.projectId, record.uopsCount]),
  )
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
          isSynced: true,
          uopsCount: 1500,
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
