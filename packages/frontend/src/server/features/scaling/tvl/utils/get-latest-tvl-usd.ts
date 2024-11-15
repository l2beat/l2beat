import {
  resolvedBridges,
  resolvedLayer2s,
  resolvedLayer3s,
} from '@l2beat/config/projects'
import { type ProjectId, UnixTime } from '@l2beat/shared-pure'
import { groupBy, sum } from 'lodash'
import { unstable_cache as cache } from 'next/cache'
import { env } from '~/env'
import { db } from '~/server/database'
import { sumValuesPerSource } from './sum-values-per-source'

/*
  This function should only be used for ordering projects by TVL.
  We fetch all projects here to avoid cache misses. Difference between
  this approach and fetching all l2s or l3s is negligible.
*/
export async function getProjectsLatestTvlUsd() {
  if (env.MOCK) {
    return getMockProjectsLatestTvlUsd()
  }
  return getCachedProjectsLatestTvlUsd()
}

type ProjectsLatestTvlUsd = Record<ProjectId, number>
const getCachedProjectsLatestTvlUsd = cache(
  async (): Promise<Record<ProjectId, number>> => {
    const values = await db.value.getLatestValues()
    const groupedByProject = groupBy(values, (e) => e.projectId)

    return Object.fromEntries(
      Object.entries(groupedByProject).map(([projectId, records]) => {
        const summedPerSource = sumValuesPerSource(records, {
          forTotal: true,
          excludeAssociatedTokens: false,
        })
        const summed = sum(Object.values(summedPerSource))
        return [projectId, Number(summed) / 100]
      }),
    )
  },
  ['latestTvlUsd'],
  {
    revalidate: 10 * UnixTime.MINUTE,
  },
)

function getMockProjectsLatestTvlUsd(): ProjectsLatestTvlUsd {
  const allProjects = [
    ...resolvedLayer2s,
    ...resolvedLayer3s,
    ...resolvedBridges,
  ]
  return Object.fromEntries(
    allProjects.map((project, i) => [project.id, allProjects.length - i]),
  )
}
