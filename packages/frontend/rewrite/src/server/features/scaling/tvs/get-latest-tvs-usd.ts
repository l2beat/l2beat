import type { ProjectId } from '@l2beat/shared-pure'
import { UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { getDb } from 'rewrite/src/server/database'
import { ps } from 'rewrite/src/server/projects'
import { env } from '~/env'

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
    const values = await db.tvsProjectValue.getLatestValues('PROJECT')

    const groupedByProject: Record<ProjectId, number> = {}
    for (const value of values) {
      groupedByProject[value.project as ProjectId] = value.value
    }

    return groupedByProject
  },
  ['latestTvsUsd-v2'],
  {
    tags: ['hourly-data'],
    revalidate: UnixTime.HOUR,
  },
)

async function getMockProjectsLatestTvsUsd(): Promise<ProjectsLatestTvsUsd> {
  const projects = await ps.getProjects({ where: ['tvsConfig'] })
  return Object.fromEntries(
    projects.map((project, i) => [project.id, projects.length - i]),
  )
}
