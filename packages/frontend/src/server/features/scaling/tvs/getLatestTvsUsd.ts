import type { ProjectId } from '@l2beat/shared-pure'
import { env } from '~/env'
import { ps } from '~/server/projects'
import { queryExecutor } from '~/server/queryExecutor'
import { getTvsProjects } from './utils/getTvsProjects'
import { getTvsTargetTimestamp } from './utils/getTvsTargetTimestamp'

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
  const target = getTvsTargetTimestamp()

  const tvsProjects = await getTvsProjects((p) => true)
  const values = await queryExecutor.execute({
    name: 'getAtTimestampPerProjectQuery',
    args: [target],
  })

  const groupedByProject: Record<ProjectId, number> = {}
  for (const { projectId } of tvsProjects) {
    const value = values.data[projectId]
    if (!value) {
      continue
    }
    groupedByProject[projectId] = value
  }

  return groupedByProject
}

async function getMockProjectsLatestTvsUsd(): Promise<ProjectsLatestTvsUsd> {
  const projects = await ps.getProjects({ where: ['tvsConfig'] })
  return Object.fromEntries(
    projects.map((project, i) => [project.id, projects.length - i]),
  )
}
