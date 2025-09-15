import { AcrossPlugin } from './across'
import { AxelarPlugin } from './axelar'
import { CCTPPlugin } from './cctp'
import { LayerZeroV2Plugin } from './layerzero-v2'
import { MayanForwarderPlugin } from './mayanforwarder'
import { MayanMctpPlugin } from './mayanmctp'
import { MayanMctpFastPlugin } from './mayanmctp-fast'
import { MayanSwiftPlugin } from './mayanswift'
import { OpStackPlugin } from './opstack'
import { OrbitStackPlugin } from './orbitstack'
import { StargatePlugin } from './stargate'
import { StargateV2BusPlugin } from './stargate-v2-bus'
import { StargateV2TaxiPlugin } from './stargate-v2-taxi'
import type { BridgePlugin } from './types'
import { Usdt0Plugin } from './usdt0'
import { WormholePlugin } from './wormhole'
import { WormholeRelayerPlugin } from './wormholerelayer'
import { WormholeTokenBridgePlugin } from './wormholetokenbridge'

export function createBridgePlugins(): BridgePlugin[] {
  return [
    new MayanForwarderPlugin(),
    new MayanSwiftPlugin(), // should be run before CCTP
    new MayanMctpPlugin(), // should be run before CCTP
    new MayanMctpFastPlugin(), // should be run before CCTP
    new CCTPPlugin(),
    new StargatePlugin(),
    new StargateV2BusPlugin(), // should be run before LayerZeroV2
    new StargateV2TaxiPlugin(), // should be run before LayerZeroV2
    new Usdt0Plugin(), // should be run before LayerZeroV2
    new LayerZeroV2Plugin(),
    new WormholeTokenBridgePlugin(), // should be run before Wormhole
    new WormholeRelayerPlugin(), // should be run before Wormhole
    new WormholePlugin(),
    new StargatePlugin(),
    new AxelarPlugin(),
    new AcrossPlugin(),
    new OrbitStackPlugin(),
    new OpStackPlugin(),
  ]
}
