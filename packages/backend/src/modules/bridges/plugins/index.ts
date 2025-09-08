import { CCTPv1Plugin } from './cctpv1'
import { StargatePlugin } from './stargate'
import type { BridgePlugin } from './types'

export function createBridgePlugins(): BridgePlugin[] {
  return [new StargatePlugin(), new CCTPv1Plugin()]
}
