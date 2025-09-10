import type { Logger } from '@l2beat/backend-tools'
import { CCTPPlugin } from './CCTPPlugin'
import { LayerZeroV2Plugin } from './layerzerov2'
import { MayanMctpFastPlugin } from './MayanMCTPFastPlugin'
import { MayanMctpPlugin } from './MayanMctpPlugin'
import { MayanSwift } from './MayanSwift'
import { StargatePlugin } from './stargate'
import { StargateV2BusPlugin } from './stargatev2bus'
import { StargateV2TaxiPlugin } from './stargatev2taxi'
import type { BridgePlugin } from './types'
import { WormholePlugin } from './wormhole'

export function createBridgePlugins(logger: Logger): BridgePlugin[] {
  return [
    new StargatePlugin(),
    new MayanSwift(),
    new MayanMctpPlugin(),
    new MayanMctpFastPlugin(),
    new CCTPPlugin(),
    new StargateV2BusPlugin(), // should be run before LayeyZeroV2
    new StargateV2TaxiPlugin(), // should be run before LayerZeroV2
    new LayerZeroV2Plugin(logger),
    new WormholePlugin(logger),
    new StargatePlugin(logger),
  ]
}
