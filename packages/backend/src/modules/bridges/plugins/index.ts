import type { Logger } from '@l2beat/backend-tools'
import { CCTPPlugin } from './CCTPPlugin'
import { MayanMCTPFastPlugin } from './MayanMCTPFastPlugin'
import { MayanMctpPlugin } from './MayanMctpPlugin'
import { StargatePlugin } from './stargate'
import type { BridgePlugin } from './types'
import { WormholePlugin } from './wormhole'

export function createBridgePlugins(logger: Logger): BridgePlugin[] {
  return [
    new StargatePlugin(),
    new MayanMctpPlugin(),
    new MayanMCTPFastPlugin(),
    new CCTPPlugin(),
    new WormholePlugin(logger),
  ]
}
