import type { ProjectId } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'

export type ProjectsLatestTvsUsd = Record<ProjectId, number>

/*
  This function should only be used for ordering projects by S.
  We fetch all projects here to avoid cache misses. Difference between
  this approach and fetching all l2s or l3s is negligible.
*/
export async function getProjectsLatestTvsUsd(): Promise<ProjectsLatestTvsUsd> {
  if (env.MOCK) {
    return getMockProjectsLatestTvsUsd()
  }
  const db = getDb()
  const values = await db.tvsProjectValue.getLatestValues('PROJECT')

  const groupedByProject: Record<ProjectId, number> = {}
  for (const value of values) {
    groupedByProject[value.project as ProjectId] = value.value
  }

  return groupedByProject
}

async function getMockProjectsLatestTvsUsd(): Promise<ProjectsLatestTvsUsd> {
  const projects = await ps.getProjects({ where: ['tvsConfig'] })
  return Object.fromEntries(
    projects.map((project, i) => [project.id, projects.length - i]),
  )
}
