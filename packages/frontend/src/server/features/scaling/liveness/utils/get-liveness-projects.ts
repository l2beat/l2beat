import { layer2s } from '@l2beat/config'

export function getLivenessProjects() {
  return layer2s.filter((p) => !p.isUpcoming && !p.isArchived)
}
