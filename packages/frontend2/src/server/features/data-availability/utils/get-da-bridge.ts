import { type DaBridge } from '@l2beat/config'

export type DaSummaryEntryBridge = {
  name: string
  slug: string
  warning?: string
  redWarning?: string
}

export function toDaBridge(daBridge: DaBridge): DaSummaryEntryBridge {
  if (daBridge.type === 'DAC') {
    return {
      name: `${daBridge.display.name} ${daBridge.requiredMembers}/${daBridge.totalMembers}`,
      slug: daBridge.display.slug,
      warning: daBridge.display.warning,
      redWarning: daBridge.display.redWarning,
    }
  }

  return {
    name: daBridge.display.name,
    slug: daBridge.display.slug,
    warning: daBridge.display.warning,
    redWarning: daBridge.display.redWarning,
  }
}
