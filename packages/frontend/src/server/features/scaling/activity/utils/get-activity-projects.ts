import { resolvedLayer2s, resolvedLayer3s } from '@l2beat/config/projects'
import { env } from '~/env'

export function getActivityProjects() {
  return [...resolvedLayer2s, ...resolvedLayer3s].filter(
    (project) =>
      !project.isArchived &&
      !project.isUpcoming &&
      project.config.transactionApi !== undefined &&
      !env.EXCLUDED_ACTIVITY_PROJECTS?.includes(project.id.toString()),
  )
}
