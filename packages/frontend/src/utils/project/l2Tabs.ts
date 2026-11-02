import type { ProjectScalingCategory } from '@l2beat/config'

/** The `?tab=` ids of the Layer 2 pages that split projects by category. */
export const L2_CATEGORY_TABS = [
  'rollups',
  'validiumsAndOptimiums',
  'others',
] as const
export type L2CategoryTab = (typeof L2_CATEGORY_TABS)[number]

/** The `?tab=` ids of the state validation page, which splits by proof system. */
export const L2_STATE_VALIDATION_TABS = [
  'validity',
  'optimistic',
  'noProofs',
] as const

export function getL2CategoryTab(
  category: ProjectScalingCategory | undefined,
): L2CategoryTab {
  if (category === 'Other') return 'others'
  if (category === 'Optimistic Rollup' || category === 'ZK Rollup') {
    return 'rollups'
  }
  return 'validiumsAndOptimiums'
}

/** The Layer 2s page that lists a project, opened on the tab it sits in. */
export function getL2ListingHref(project: {
  category: ProjectScalingCategory | undefined
  isArchived: boolean
}): string {
  if (project.isArchived) return '/layer2s/archived'
  const tab = getL2CategoryTab(project.category)
  // The summary opens on rollups, so their link stays the canonical URL.
  return tab === 'rollups' ? '/layer2s/summary' : `/layer2s/summary?tab=${tab}`
}
