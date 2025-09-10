import type { Logger } from '@l2beat/backend-tools'
import { CCTPPlugin } from './CCTPPlugin'
import { MayanMctpFastPlugin } from './MayanMCTPFastPlugin'
import { MayanMctpPlugin } from './MayanMctpPlugin'
import { StargatePlugin } from './stargate'
import type { BridgePlugin } from './types'
import { WormholePlugin } from './wormhole'
import { MayanSwift } from './MayanSwift'

export function createBridgePlugins(logger: Logger): BridgePlugin[] {
  return [
    new StargatePlugin(),
    new MayanSwift(),
    new MayanMctpPlugin(),
    new MayanMctpFastPlugin(),
    new CCTPPlugin(),
    new WormholePlugin(logger),
  ]
}
