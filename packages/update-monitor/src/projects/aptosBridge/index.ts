import { DiscoveryEngine } from '../../discovery/DiscoveryEngine'
import { addresses } from './constants'

export const APTOS_NAME = 'aptos'

export async function discoverAptos(discoveryEngine: DiscoveryEngine) {
  await discoveryEngine.discover(APTOS_NAME, [addresses.aptosBridge])
}
