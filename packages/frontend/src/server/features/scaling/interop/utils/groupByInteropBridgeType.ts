import type { InteropBridgeType } from '@l2beat/shared-pure'

export type GrupedInteropEntries<T extends { bridgeType: InteropBridgeType }> =
  {
    nonMinting: T[]
    lockAndMint: T[]
    omnichain: T[]
  }

export function groupByInteropBridgeType<
  T extends { bridgeType: InteropBridgeType },
>(projects: T[]): GrupedInteropEntries<T> {
  const result: GrupedInteropEntries<T> = {
    nonMinting: [],
    lockAndMint: [],
    omnichain: [],
  }

  for (const project of projects) {
    result[project.bridgeType].push(project)
  }

  return result
}
