import { providers } from 'ethers'

import { DiscoveryEngine } from '../../discovery/DiscoveryEngine'
import { ProjectParameters } from '../../types'
import { addresses } from './constants'
import { getErc20Bridge } from './contracts/erc20Bridge'
import { getEthBridge } from './contracts/ethBridge'
import { getGps } from './contracts/gps'
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
      getGps(provider),
      getErc20Bridge(provider, addresses.wbtcBridge, 'WbtcBridge'),
      getErc20Bridge(provider, addresses.usdcBridge, 'UsdcBridge'),
      getErc20Bridge(provider, addresses.usdtBridge, 'UsdtBridge'),
    ]),
  }
}

export async function discoverStarkNet(discoveryEngine: DiscoveryEngine) {
  await discoveryEngine.discover(STARK_NET_NAME, [
    addresses.starkNet,
    addresses.ethBridge,
    addresses.wbtcBridge,
    addresses.gpsStatementVerifier,
  ])
}
