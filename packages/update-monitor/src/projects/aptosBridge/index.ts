
import { DiscoveryEngine } from '../../discovery/DiscoveryEngine'
import { addresses } from './constants'

export const APTOS_NAME = 'aptos'

/*
export async function getHopParameters(
  provider: providers.JsonRpcProvider,
): Promise<ProjectParameters> {
  const parameters: ProjectParameters = {
    name: APTOS_NAME,
    contracts: await Promise.all([
      getHopBridgeParams(provider, addresses.usdcBridge, 'USDC Bridge'),
      getHopBridgeParams(provider, addresses.usdtBridge, 'USDT Bridge'),
      getHopBridgeParams(provider, addresses.daiBridge, 'DAI Bridge'),
      getHopBridgeParams(provider, addresses.ethBridge, 'ETH Bridge'),
      getHopBridgeParams(provider, addresses.maticBridge, 'MATIC Bridge'),
      getHopBridgeParams(provider, addresses.wbtcBridge, 'WBTC Bridge'),
    ]),
  }
  return parameters
}*/

export async function discoverAptos(discoveryEngine: DiscoveryEngine) {
  await discoveryEngine.discover(APTOS_NAME, [addresses.aptosBridge])
}
