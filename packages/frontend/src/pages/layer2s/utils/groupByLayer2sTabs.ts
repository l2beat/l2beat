import type { CommonLayer2sEntry } from '~/server/features/layer2s/getCommonLayer2sEntry'

export type TabbedLayer2sEntries<T extends { tab: CommonLayer2sEntry['tab'] }> =
  {
    rollups: T[]
    validiumsAndOptimiums: T[]
    others: T[]
  }

export function groupByLayer2sTabs<
  T extends { tab: CommonLayer2sEntry['tab'] },
>(projects: T[]): TabbedLayer2sEntries<T> {
  return {
    rollups: projects.filter((p) => p.tab === 'rollups'),
    validiumsAndOptimiums: projects.filter(
      (p) => p.tab === 'validiumsAndOptimiums',
    ),
    others: projects.filter((p) => p.tab === 'others'),
  }
}
