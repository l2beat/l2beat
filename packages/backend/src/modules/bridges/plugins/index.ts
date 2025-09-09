import { StargatePlugin } from './stargate'
import type { BridgePlugin } from './types'

export function createBridgePlugins(): BridgePlugin[] {
  return [new StargatePlugin()]
}
