import { type Layer2, layer2s } from '@l2beat/config'

const UPCOMING_PROJECTS = ['paradex']

export function getCostsProjects(): Layer2[] {
  return layer2s.filter(
    (p) =>
      (p.config.trackedTxs !== undefined ||
        UPCOMING_PROJECTS.includes(p.id.toString())) &&
      !p.isArchived &&
      !p.isUpcoming &&
      (p.display.category === 'Optimistic Rollup' ||
        p.display.category === 'ZK Rollup'),
  )
}
