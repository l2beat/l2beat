import { providers } from 'ethers'

import { DiscoveryEngine } from '../../discovery/DiscoveryEngine'
import { ProjectParameters } from '../../types'
import { addresses } from './constants'
import { getBridge } from './contracts/SolletBridge'

export const SOLLET_BRIDGE_NAME = 'solletBridge'

export async function getSolletBridgeParameters(
  provider: providers.JsonRpcProvider,
): Promise<ProjectParameters> {
  const parameters: ProjectParameters = {
    name: SOLLET_BRIDGE_NAME,
    contracts: await Promise.all([getBridge(provider)]),
  }
  return parameters
}

export async function discoverSolletBridge(discoveryEngine: DiscoveryEngine) {
  await discoveryEngine.discover(SOLLET_BRIDGE_NAME, [addresses.bridge])
}
