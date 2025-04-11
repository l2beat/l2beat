import type { CommonBridgesEntry } from '~/server/features/bridges/get-common-bridges-entry'

export type TabbedBridgeEntries<T extends CommonBridgesEntry> = {
  singleChain: T[]
  multichain: T[]
}

export function groupByBridgeTabs<T extends CommonBridgesEntry>(
  projects: T[],
): TabbedBridgeEntries<T> {
  return {
    singleChain: projects.filter((p) => p.category === 'Single-chain'),
    multichain: projects.filter((p) => p.category !== 'Single-chain'),
  }
}
