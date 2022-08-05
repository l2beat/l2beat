import { providers } from 'ethers'

import { getSimpleStarkWare2019Proxy } from '../../common/getSimpleStarkWare2019Proxy'
import { DiscoveryEngine } from '../../discovery/DiscoveryEngine'
import { ProjectParameters } from '../../types'
import { addresses } from './constants'
import { getEthBridge } from './contracts/ethBridge'
import { getStarkNet } from './contracts/starknet'

export const STARK_NET_NAME = 'starkNet'

export async function getStarkNetParameters(
  provider: providers.JsonRpcProvider,
): Promise<ProjectParameters> {
  return {
    name: STARK_NET_NAME,
    contracts: await Promise.all([
      getStarkNet(provider),
      getEthBridge(provider),
      getSimpleStarkWare2019Proxy(provider, addresses.wbtcBridge, 'WbtcBridge'),
    ]),
  }
}

export async function discoverStarkNet(discoveryEngine: DiscoveryEngine) {
  await discoveryEngine.discover(STARK_NET_NAME, [
    addresses.starkNet,
    addresses.ethBridge,
    addresses.wbtcBridge,
  ])
}
