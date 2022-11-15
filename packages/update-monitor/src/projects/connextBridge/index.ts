import { DiscoveryEngine } from '../../discovery/DiscoveryEngine'

export const CONNEXT_BRIDGE_NAME = 'connextBridge'

export async function discoverConnextBridge(discoveryEngine: DiscoveryEngine) {
  await discoveryEngine.discover(CONNEXT_BRIDGE_NAME, [
    '0x31eFc4AeAA7c39e54A33FDc3C46ee2Bd70ae0A09',
  ])
}
