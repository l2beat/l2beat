import { type DaBridge } from '@l2beat/config'

export type DaSummaryEntryBridge = {
  name: string
  slug: string
  type: DaBridge['type']
}

export function toDaBridge(daBridge: DaBridge): DaSummaryEntryBridge {
  if (daBridge.type === 'DAC') {
    if (daBridge.requiredMembers === 0) {
      return {
        name: daBridge.display.name,
        slug: daBridge.display.slug,
        type: daBridge.type,
      }
    }
    return {
      name: `${daBridge.requiredMembers}/${daBridge.membersCount} members`,
      slug: daBridge.display.slug,
      type: daBridge.type,
    }
  }

  return {
    name: daBridge.display.name,
    slug: daBridge.display.slug,
    type: daBridge.type,
  }
}
