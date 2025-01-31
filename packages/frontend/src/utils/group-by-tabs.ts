import type { CommonScalingEntry } from '~/server/features/scaling/get-common-scaling-entry'

export type TabbedScalingEntries<T extends CommonScalingEntry> = {
  rollups: T[]
  validiumsAndOptimiums: T[]
  others: T[]
}

export function groupByTabs<T extends CommonScalingEntry>(
  projects: T[],
): TabbedScalingEntries<T> {
  return {
    rollups: projects.filter((p) => p.tab === 'Rollups'),
    validiumsAndOptimiums: projects.filter(
      (p) => p.tab === 'ValidiumsAndOptimiums',
    ),
    others: projects.filter((p) => p.tab === 'Others'),
  }
}
