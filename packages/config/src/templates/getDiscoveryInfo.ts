import type { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import type { ProjectDiscoveryInfo } from '../types'

export function getDiscoveryInfo(
  discoveries: ProjectDiscovery[],
): ProjectDiscoveryInfo {
  const blockNumberPerChain: Record<string, number> = {}

  for (const { chain, timestamp } of discoveries) {
    blockNumberPerChain[chain] ??= Number.POSITIVE_INFINITY
    blockNumberPerChain[chain] = Math.min(
      blockNumberPerChain[chain],
      timestamp,
    )
  }

  return {
    // NOTE(radomski): This will be overwritten later by adjustments
    isDiscoDriven: false,
    permissionsDiscoDriven: false,
    contractsDiscoDriven: false,
    blockNumberPerChain,
    hasDiscoUi: false,
  }
}
