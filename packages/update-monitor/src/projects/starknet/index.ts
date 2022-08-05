import { providers } from 'ethers'

import { DiscoveryEngine } from '../../discovery/DiscoveryEngine'
import { ProjectParameters } from '../../types'

export const STARK_NET_NAME = 'starkNet'

export async function getStarkNetParameters(
  provider: providers.JsonRpcProvider,
): Promise<ProjectParameters> {
  return {
    name: STARK_NET_NAME,
    contracts: await Promise.all([
    ]),
  }
}

export async function discoverStarkNet(discoveryEngine: DiscoveryEngine) {
  await discoveryEngine.discover(STARK_NET_NAME, [])
}
