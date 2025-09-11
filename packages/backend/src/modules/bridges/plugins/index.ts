import type { Logger } from '@l2beat/backend-tools'
import { CCTPPlugin } from './cctp'
import { LayerZeroV2Plugin } from './layerzero-v2'
import { MayanMctpPlugin } from './mayanmctp'
import { MayanMctpFastPlugin } from './mayanmctp-fast'
import { MayanSwiftPlugin } from './mayanswift'
import { StargatePlugin } from './stargate'
import { StargateV2BusPlugin } from './stargate-v2-bus'
import { StargateV2TaxiPlugin } from './stargate-v2-taxi'
import type { BridgePlugin } from './types'
import { Usdt0Plugin } from './usdt0'
import { WormholeTokenBridgePlugin } from './WormholeTokenBridgePlugin'
import { WormholePlugin } from './wormhole'

export function createBridgePlugins(logger: Logger): BridgePlugin[] {
  return [
    new MayanSwiftPlugin(), // should be run before CCTP
    new MayanMctpPlugin(), // should be run before CCTP
    new MayanMctpFastPlugin(), // should be run before CCTP
    new CCTPPlugin(),
    new StargateV2BusPlugin(), // should be run before LayeyZeroV2
    new StargateV2TaxiPlugin(), // should be run before LayerZeroV2
    new Usdt0Plugin(), // should be run before LayerZeroV2
    new LayerZeroV2Plugin(logger),
    new WormholeTokenBridgePlugin(), // should be run before Wormhole
    new WormholePlugin(logger),
    new StargatePlugin(logger),
  ]
}
