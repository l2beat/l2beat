import { OneinchFusionPlusPlugin } from './1inchfusionplus'
import { AcrossPlugin } from './across'
import { AllbridgePlugIn } from './allbridge'
import { AoriPlugin } from './aori'
import { AxelarPlugin } from './axelar'
import { AxelarITSPlugin } from './axelar-its'
import { CCIPPlugIn } from './ccip'
import { CCTPPlugin } from './cctp'
import { CentriFugePlugin } from './centrifuge'
import { CircleGatewayPlugIn } from './circle-gateway'
import { DeBridgePlugin } from './debridge'
import { DeBridgeDlnPlugin } from './debridge-dln'
import { HyperlanePlugIn } from './hyperlane'
import { HyperlaneEcoPlugin } from './hyperlane-eco'
import { HyperlaneHwrPlugin } from './hyperlane-hwr'
import { HyperlaneMerklyTokenBridgePlugin } from './hyperlane-merkly-tokenbridge'
import { LayerZeroV1Plugin } from './layerzero-v1'
import { LayerZeroV2Plugin } from './layerzero-v2'
import { LayerZeroV2OFTsPlugin } from './layerzero-v2-ofts'
import { MayanForwarderPlugin } from './mayan-forwarder'
import { MayanMctpPlugin } from './mayan-mctp'
import { MayanMctpFastPlugin } from './mayan-mctp-fast'
import { MayanSwiftPlugin } from './mayan-swift'
import { OpStackPlugin } from './opstack'
import { OrbitStackPlugin } from './orbitstack'
import { SquidCoralPlugin } from './squid-coral'
import { StargatePlugin } from './stargate'
import { StargateV2BusPlugin } from './stargate-v2-bus'
import { StargateV2CreditPlugin } from './stargate-v2-credit'
import { StargateV2TaxiPlugin } from './stargate-v2-taxi'
import { SuperformPlugin } from './superform'
import type { InteropPlugin } from './types'
import { WormholePlugin } from './wormhole'
import { WormholeNTTPlugin } from './wormhole-ntt'
import { WormholeRelayerPlugin } from './wormhole-relayer'
import { WormholeTokenBridgePlugin } from './wormhole-token-bridge'

export function createInteropPlugins(): InteropPlugin[] {
  return [
    new SquidCoralPlugin(),
    new DeBridgePlugin(),
    new DeBridgeDlnPlugin(),
    new MayanForwarderPlugin(),
    new CircleGatewayPlugIn(),
    new CCIPPlugIn(),
    new CentriFugePlugin(), // should be run before Wormhole and Axelar (uses both and who knows what else)
    new MayanSwiftPlugin(), // should be run before CCTP
    new MayanMctpPlugin(), // should be run before CCTP
    new MayanMctpFastPlugin(), // should be run before CCTP
    new CCTPPlugin(),
    new StargatePlugin(), // should be run before stargate bus/taxi, ofts
    new StargateV2BusPlugin(), // should be run before LayerZeroV2, ofts
    new StargateV2TaxiPlugin(), // should be run before LayerZeroV2, ofts
    new LayerZeroV2OFTsPlugin(), // should be run before LayerZeroV2
    new LayerZeroV1Plugin(),
    new AoriPlugin(), // should be run before LayerZeroV2
    new SuperformPlugin(), // should be run before LayerZeroV2, after most LZ apps
    new StargateV2CreditPlugin(), // should be run before LayerZeroV2, after stargate
    new LayerZeroV2Plugin(),
    new WormholeNTTPlugin(), // should be run before WormholeCore and WormholeRelayer
    new WormholeTokenBridgePlugin(), // should be run before Wormhole
    new WormholeRelayerPlugin(), // should be run before Wormhole
    new WormholePlugin(),
    new AllbridgePlugIn(),
    new AxelarITSPlugin(), // should be run before Axelar
    new AxelarPlugin(),
    new AcrossPlugin(),
    new OrbitStackPlugin(),
    new OpStackPlugin(),
    new HyperlaneMerklyTokenBridgePlugin(), // should be run before HyperlaneHWR
    new HyperlaneHwrPlugin(), // should be run before Hyperlane
    new HyperlaneEcoPlugin(), // should be run before Hyperlane
    new HyperlanePlugIn(),
    new OneinchFusionPlusPlugin(),
  ]
}
