import type { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import type { ProjectDiscoveryInfo } from '../types'

export function getDiscoveryInfo(
  discoveries: ProjectDiscovery[],
): ProjectDiscoveryInfo {
  let baseTimestamp = undefined

  for (const discovery of discoveries) {
    baseTimestamp = Math.min(
      baseTimestamp ?? Number.POSITIVE_INFINITY,
      discovery.maxTimestamp,
    )
  }

  return {
    // NOTE(radomski): This will be overwritten later by adjustments
    isDiscoDriven: false,
    permissionsDiscoDriven: false,
    contractsDiscoDriven: false,
    baseTimestamp,
    hasDiscoUi: false,
  }
}
