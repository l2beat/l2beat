import type { Logger } from '@l2beat/backend-tools'
import { CCTPv1Plugin } from './cctpv1'
import { MayanPlugin } from './mayan'
import { StargatePlugin } from './stargate'
import type { BridgePlugin } from './types'
import { WormholePlugin } from './wormhole'

export function createBridgePlugins(logger: Logger): BridgePlugin[] {
  return [
    new StargatePlugin(),
    new MayanPlugin(),
    new CCTPv1Plugin(),
    new WormholePlugin(logger),
  ]
}
