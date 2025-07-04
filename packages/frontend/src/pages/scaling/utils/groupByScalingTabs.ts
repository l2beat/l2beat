import type { CommonScalingEntry } from '~/server/features/scaling/getCommonScalingEntry'

export type TabbedScalingEntries<T extends { tab: CommonScalingEntry['tab'] }> =
  {
    rollups: T[]
    validiumsAndOptimiums: T[]
    others: T[]
    notReviewed: T[]
  }

export function groupByScalingTabs<
  T extends { tab: CommonScalingEntry['tab'] },
>(projects: T[]): TabbedScalingEntries<T> {
  return {
    rollups: projects.filter((p) => p.tab === 'rollups'),
    validiumsAndOptimiums: projects.filter(
      (p) => p.tab === 'validiumsAndOptimiums',
    ),
    others: projects.filter((p) => p.tab === 'others'),
    notReviewed: projects.filter((p) => p.tab === 'notReviewed'),
  }
}
