import type { CommonBridgesEntry } from '~/server/features/bridges/get-common-bridges-entry'

export type TabbedBridgeEntries<T extends CommonBridgesEntry> = {
  singleChain: T[]
  others: T[]
}

export function groupByBridgeTabs<T extends CommonBridgesEntry>(
  projects: T[],
): TabbedBridgeEntries<T> {
  return {
    singleChain: projects.filter((p) => p.category === 'Single-chain'),
    others: projects.filter((p) => p.category !== 'Single-chain'),
  }
}
