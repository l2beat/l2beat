import { type DaBridge } from '@l2beat/config'

export type DaSummaryEntryBridge = {
  name: string
  slug: string
}

export function toDaBridge(daBridge: DaBridge): DaSummaryEntryBridge {
  if (daBridge.type === 'DAC') {
    return {
      name: `${daBridge.requiredMembers}/${daBridge.totalMembers} members`,
      slug: daBridge.display.slug,
    }
  }

  return {
    name: daBridge.display.name,
    slug: daBridge.display.slug,
  }
}
