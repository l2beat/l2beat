import { AcrossPlugin } from './across'
import { AllbridgePlugIn } from './allbridge'
import { AxelarPlugin } from './axelar'
import { AxelarITSPlugin } from './axelar-its'
import { CCIPPlugIn } from './ccip'
import { CCTPPlugin } from './cctp'
import { DeBridgePlugin } from './debridge'
import { DeBridgeDlnPlugin } from './debridge-dln'
import { HyperlanePlugIn } from './hyperlane'
import { LayerZeroV1Plugin } from './layerzero-v1'
import { LayerZeroV2Plugin } from './layerzero-v2'
import { MayanForwarderPlugin } from './mayan-forwarder'
import { MayanMctpPlugin } from './mayan-mctp'
import { MayanMctpFastPlugin } from './mayan-mctp-fast'
import { MayanSwiftPlugin } from './mayan-swift'
import { OpStackPlugin } from './opstack'
import { OrbitStackPlugin } from './orbitstack'
import { SquidCoralPlugin } from './squid-coral'
import { StargatePlugin } from './stargate'
import { StargateV2BusPlugin } from './stargate-v2-bus'
import { StargateV2TaxiPlugin } from './stargate-v2-taxi'
import type { BridgePlugin } from './types'
import { Usdt0Plugin } from './usdt0'
import { WormholePlugin } from './wormhole'
import { WormholeRelayerPlugin } from './wormhole-relayer'
import { WormholeTokenBridgePlugin } from './wormhole-token-bridge'

export function createBridgePlugins(): BridgePlugin[] {
  return [
    new SquidCoralPlugin(),
    new DeBridgePlugin(),
    new DeBridgeDlnPlugin(),
    new MayanForwarderPlugin(),
    new CCIPPlugIn(),
    new MayanSwiftPlugin(), // should be run before CCTP
    new MayanMctpPlugin(), // should be run before CCTP
    new MayanMctpFastPlugin(), // should be run before CCTP
    new CCTPPlugin(),
    new StargatePlugin(),
    new StargateV2BusPlugin(), // should be run before LayerZeroV2
    new StargateV2TaxiPlugin(), // should be run before LayerZeroV2
    new Usdt0Plugin(), // should be run before LayerZeroV2
    new LayerZeroV1Plugin(),
    new LayerZeroV2Plugin(),
    new WormholeTokenBridgePlugin(), // should be run before Wormhole
    new WormholeRelayerPlugin(), // should be run before Wormhole
    new WormholePlugin(),
    new StargatePlugin(),
    new AllbridgePlugIn(),
    new AxelarITSPlugin(), // should be run before Axelar
    new AxelarPlugin(),
    new AcrossPlugin(),
    new OrbitStackPlugin(),
    new OpStackPlugin(),
    new HyperlanePlugIn(),
  ]
}
