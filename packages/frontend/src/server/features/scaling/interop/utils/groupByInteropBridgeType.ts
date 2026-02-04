import type { InteropBridgeType } from '@l2beat/shared-pure'
import { assert } from '@l2beat/shared-pure'

export type GroupedInteropEntries<
  T extends { bridgeTypes: InteropBridgeType[] },
> = {
  nonMinting: T[]
  lockAndMint: T[]
  omnichain: T[]
}

export function groupByInteropBridgeType<
  T extends { bridgeTypes: InteropBridgeType[] },
>(projects: T[]): GroupedInteropEntries<T> {
  const result: GroupedInteropEntries<T> = {
    nonMinting: [],
    lockAndMint: [],
    omnichain: [],
  }

  for (const project of projects) {
    const bridgeType = project.bridgeTypes[0]
    assert(
      project.bridgeTypes.length === 1 && bridgeType !== undefined,
      'Project must have exactly one bridge type',
    )
    result[bridgeType].push(project)
  }

  return result
}
