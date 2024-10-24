import { resolvedLayer2s } from '@l2beat/config/projects'

export function getLivenessProjects() {
  return resolvedLayer2s.filter(
    (p) =>
      (p.display.category === 'Optimistic Rollup' ||
        p.display.category === 'ZK Rollup') &&
      !p.isUpcoming &&
      !p.isArchived,
  )
}
