import { layer2s } from '@l2beat/config'

export function getLivenessProjects() {
  return layer2s.filter(
    (p) =>
      (p.display.category === 'Optimistic Rollup' ||
        p.display.category === 'ZK Rollup') &&
      !p.isUpcoming &&
      !p.isArchived,
  )
}
