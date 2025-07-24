import type { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import type { ProjectDiscoveryInfo } from '../types'

export function getDiscoveryInfo(
  discoveries: ProjectDiscovery[],
): ProjectDiscoveryInfo {
  const timestampPerChain: Record<string, number> = {}

  for (const { chain, timestamp } of discoveries) {
    timestampPerChain[chain] ??= Number.POSITIVE_INFINITY
    timestampPerChain[chain] = Math.min(timestampPerChain[chain], timestamp)
  }

  return {
    // NOTE(radomski): This will be overwritten later by adjustments
    isDiscoDriven: false,
    permissionsDiscoDriven: false,
    contractsDiscoDriven: false,
    timestampPerChain,
    hasDiscoUi: false,
  }
}
