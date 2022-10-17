import { providers } from 'ethers'

import { DiscoveryEngine } from '../../discovery/DiscoveryEngine'
import { ProjectParameters } from '../../types'
import { addresses } from './constants'
import { getBridgeWithGovernance } from './contracts/bridge'

export const ORBIT_BRIDGE_NAME = 'orbitBridge'

export async function getOrbitBridgeParameters(
  provider: providers.JsonRpcProvider,
): Promise<ProjectParameters> {
  const parameters: ProjectParameters = {
    name: ORBIT_BRIDGE_NAME,
    contracts: await Promise.all([getBridgeWithGovernance(provider)]),
  }
  return parameters
}

export async function discoverOrbitBridge(discoveryEngine: DiscoveryEngine) {
  await discoveryEngine.discover(ORBIT_BRIDGE_NAME, [addresses.bridge], {
    skipMethods: {
      [addresses.bridge]: [
        'transactions',
        'isConfirmed',
        'getConfirmations',
        'getConfirmationCount',
        'tetherAddress',
        'owners',
      ],
    },
  })
}
