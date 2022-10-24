import { providers } from 'ethers'

import { DiscoveryEngine } from '../../discovery/DiscoveryEngine'
import { ProjectParameters } from '../../types'
import { addresses } from './constants'
import { getCBridge } from './contracts/getCBridge'
import { getGovernance } from './contracts/getGovernance'

export const CBRIDGE_NAME = 'cBridge'

export async function getCBridgeParameters(
  provider: providers.JsonRpcProvider,
): Promise<ProjectParameters> {
  return {
    name: CBRIDGE_NAME,
    contracts: await Promise.all([
      getCBridge(provider),
      getGovernance(provider),
    ]),
  }
}

export async function discoverCBridge(discoveryEngine: DiscoveryEngine) {
  await discoveryEngine.discover(
    CBRIDGE_NAME,
    [addresses.cBridge, addresses.governance],
    {
      skipMethods: {
        '0xF380166F8490F24AF32Bf47D1aA217FBA62B6575': ['proposals'],
      },
    },
  )
}
