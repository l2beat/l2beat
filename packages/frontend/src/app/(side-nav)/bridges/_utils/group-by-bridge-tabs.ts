import type { CommonBridgesEntry } from 'rewrite/src/server/features/bridges/get-common-bridges-entry'

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
