import type { Logger } from '@l2beat/backend-tools'
import { CCTPv1Plugin } from './cctpv1'
import { LayerZeroV2Plugin } from './layerzerov2'
import { MayanPlugin } from './mayan'
import { StargateV2BusPlugin } from './stargatev2bus'
import { StargateV2TaxiPlugin } from './stargatev2taxi'
import type { BridgePlugin } from './types'
import { WormholePlugin } from './wormhole'

export function createBridgePlugins(logger: Logger): BridgePlugin[] {
  return [
    new MayanPlugin(), // Should be run before CCTPv1
    new CCTPv1Plugin(),
    new StargateV2BusPlugin(), // should be run before LayeyZeroV2
    new StargateV2TaxiPlugin(), // should be run before LayerZeroV2
    new LayerZeroV2Plugin(logger),
    new WormholePlugin(logger),
  ]
}
