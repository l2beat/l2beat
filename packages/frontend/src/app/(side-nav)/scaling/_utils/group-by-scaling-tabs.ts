import type { CommonScalingEntry } from '~/server/features/scaling/get-common-scaling-entry'

export type TabbedScalingEntries<T extends CommonScalingEntry> = {
  rollups: T[]
  validiumsAndOptimiums: T[]
  others: T[]
  underReview: T[]
}

export function groupByScalingTabs<T extends CommonScalingEntry>(
  projects: T[],
): TabbedScalingEntries<T> {
  const underReview = projects.filter(
    (p) => p.statuses?.underReview === 'config',
  )
  const rest = projects.filter((p) => p.statuses?.underReview !== 'config')

  return {
    rollups: rest.filter((p) => p.tab === 'rollups'),
    validiumsAndOptimiums: rest.filter(
      (p) => p.tab === 'validiumsAndOptimiums',
    ),
    others: rest.filter((p) => p.tab === 'others'),
    underReview,
  }
}
