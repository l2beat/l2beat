import { layer2s, layer3s } from '@l2beat/config'
import { env } from '~/env'

export function getActivityProjects() {
  return [...layer2s, ...layer3s].filter(
    (project) =>
      !project.isUpcoming &&
      project.config.transactionApi !== undefined &&
      !env.EXCLUDED_ACTIVITY_PROJECTS?.includes(project.id.toString()),
  )
}
