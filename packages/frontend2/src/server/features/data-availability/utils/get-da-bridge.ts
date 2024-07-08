import { type DaBridge, isDacBridge } from '@l2beat/config'

export type DaSummaryEntryBridge = {
  name: string
  slug: string
}

export function toDaBridge(bridge: DaBridge): DaSummaryEntryBridge {
  if (isDacBridge(bridge)) {
    return {
      name: `${bridge.display.name} ${bridge.requiredMembers}/${bridge.totalMembers}`,
      slug: bridge.display.slug,
    }
  }

  return {
    name: bridge.display.name,
    slug: bridge.display.slug,
  }
}
