import type { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import type { ProjectDiscoveryInfo } from '../types'

export function getDiscoveryInfo(
  discoveries: ProjectDiscovery[],
): ProjectDiscoveryInfo {
  const blockNumberPerChain: Record<string, number> = {}

  for (const { chain, blockNumber } of discoveries) {
    blockNumberPerChain[chain] ??= Infinity
    blockNumberPerChain[chain] = Math.min(
      blockNumberPerChain[chain],
      blockNumber,
    )
  }

  return {
    // NOTE(radomski): This will be overwritten later by adjustments
    isDiscoDriven: false,
    permissionsDiscoDriven: false,
    contractsDiscoDriven: false,
    blockNumberPerChain,
  }
}
