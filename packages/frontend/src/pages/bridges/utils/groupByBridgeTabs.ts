import type { CommonBridgesEntry } from '~/server/features/bridges/getCommonBridgesEntry'

export type TabbedBridgeEntries<
  T extends { category: CommonBridgesEntry['category'] },
> = {
  singleChain: T[]
  others: T[]
}

export function groupByBridgeTabs<
  T extends { category: CommonBridgesEntry['category'] },
>(projects: T[]): TabbedBridgeEntries<T> {
  return {
    singleChain: projects.filter((p) => p.category === 'Single-chain'),
    others: projects.filter((p) => p.category !== 'Single-chain'),
  }
}
