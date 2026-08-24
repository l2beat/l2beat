import type { CommonL2Entry } from '~/server/features/layer2s/getCommonL2Entry'

export type TabbedL2Entries<T extends { tab: CommonL2Entry['tab'] }> = {
  rollups: T[]
  validiumsAndOptimiums: T[]
  others: T[]
}

export function groupByL2Tabs<T extends { tab: CommonL2Entry['tab'] }>(
  projects: T[],
): TabbedL2Entries<T> {
  return {
    rollups: projects.filter((p) => p.tab === 'rollups'),
    validiumsAndOptimiums: projects.filter(
      (p) => p.tab === 'validiumsAndOptimiums',
    ),
    others: projects.filter((p) => p.tab === 'others'),
  }
}
