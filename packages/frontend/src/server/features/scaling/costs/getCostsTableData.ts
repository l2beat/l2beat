import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import type { ChartRange } from '~/utils/range/range'
import { getSummedActivityForProjects } from '../activity/getSummedActivityForProjects'
import { getCostsForProjects } from './getCostsForProjects'
import type { LatestCostsProjectResponse, LatestCostsValues } from './types'
import { getCostsProjects } from './utils/getCostsProjects'
import { isCostsSynced } from './utils/isCostsSynced'

type LatestCostsValuesWithTotal = LatestCostsValues & {
  total: number
}

export type CostsTableData = Record<
  string,
  {
    isSynced: boolean
    uopsCount: number | undefined
    gas: LatestCostsValuesWithTotal
    eth: LatestCostsValuesWithTotal
    usd: LatestCostsValuesWithTotal
  }
>

export async function getCostsTable(
  range: ChartRange,
): Promise<CostsTableData> {
  if (env.MOCK) {
    return getMockCostsTableData()
  }

  const projects = (await getCostsProjects()).filter((p) => !p.archivedAt)

  const projectsCosts = await getCostsForProjects(projects, range)
  const rangeByProject = Object.fromEntries(
    Object.entries(projectsCosts).map(([projectId, data]) => {
      return [projectId, data.range]
    }),
  )
  const projectsActivity = await getSummedActivityForProjects(
    projects.map((p) => p.id),
    range,
    rangeByProject,
  )

  return Object.fromEntries(
    Object.entries(projectsCosts).map(([projectId, costs]) => {
      const isSynced = isCostsSynced({
        syncedUntil: costs.syncedUntil,
        to: UnixTime.now(),
      })
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

async function getMockCostsTableData(): Promise<CostsTableData> {
  const projects = await getCostsProjects()

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
