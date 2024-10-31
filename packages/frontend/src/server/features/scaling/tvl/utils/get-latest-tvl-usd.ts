import { bridges, layer2s, layer3s } from '@l2beat/config'
import { type ProjectId, UnixTime } from '@l2beat/shared-pure'
import { groupBy, sum } from 'lodash'
import { unstable_noStore as noStore } from 'next/cache'
import { env } from '~/env'
import { db } from '~/server/database'
import { sumValuesPerSource } from './sum-values-per-source'
import { cache } from '~/utils/cache'

/*
  This function should only be used for ordering projects by TVL.
  We fetch all projects here to avoid cache misses. Difference between
  this approach and fetching all l2s or l3s is negligible.
*/
export async function getProjectsLatestTvlUsd() {
  if (env.MOCK) {
    return getMockProjectsLatestTvlUsd()
  }
  noStore()
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
  const allProjects = [...layer2s, ...layer3s, ...bridges]
  return Object.fromEntries(
    allProjects.map((project, i) => [project.id, allProjects.length - i]),
  )
}
