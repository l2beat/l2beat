import { layer2s, layer3s } from '@l2beat/config'

export function getActivityProjects() {
  return [...layer2s, ...layer3s].filter(
    (project) =>
      !project.isArchived &&
      !project.isUpcoming &&
      project.config.transactionApi !== undefined,
  )
}
