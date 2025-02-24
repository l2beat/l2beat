import { bridges, layer2s, layer3s } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import { UnixTime } from '@l2beat/shared-pure'
import { groupBy, sum } from 'lodash'
import { unstable_cache as cache } from 'next/cache'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { sumValuesPerSource } from './sum-values-per-source'

/*
  This function should only be used for ordering projects by S.
  We fetch all projects here to avoid cache misses. Difference between
  this approach and fetching all l2s or l3s is negligible.
*/
export async function getProjectsLatestTvsUsd() {
  if (env.MOCK) {
    return getMockProjectsLatestTvsUsd()
  }
  return getCachedProjectsLatestTvsUsd()
}

export type ProjectsLatestTvsUsd = Record<ProjectId, number>
const getCachedProjectsLatestTvsUsd = cache(
  async (): Promise<Record<ProjectId, number>> => {
    const db = getDb()
    const values = await db.value.getLatestValues()
    const groupedByProject = groupBy(values, (e) => e.projectId)

    return Object.fromEntries(
      Object.entries(groupedByProject).map(([projectId, records]) => {
        const summedPerSource = sumValuesPerSource(records, {
          forTotal: false,
          excludeAssociatedTokens: false,
        })
        const summed = sum(Object.values(summedPerSource))
        return [projectId, Number(summed) / 100]
      }),
    )
  },
  ['latestTvsUsd-v2'],
  {
    tags: ['hourly-data'],
    revalidate: UnixTime.HOUR,
  },
)

function getMockProjectsLatestTvsUsd(): ProjectsLatestTvsUsd {
  const allProjects = [...layer2s, ...layer3s, ...bridges]
  return Object.fromEntries(
    allProjects.map((project, i) => [project.id, allProjects.length - i]),
  )
}
