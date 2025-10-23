import type { Logger } from '@l2beat/backend-tools'
import type { HttpClient, RpcClient } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import type { InteropComparePlugin } from '../engine/compare/InteropCompareLoop'
import type {
  InteropConfigPlugin,
  InteropConfigStore,
} from '../engine/config/InteropConfigStore'
import { OneinchFusionPlusPlugin } from './1inchfusionplus'
import { AcrossComparePlugin } from './across/across.compare'
import { AcrossConfigPlugin } from './across/across.config'
import { AcrossPlugin } from './across/across.plugin'
import { AllbridgePlugIn } from './allbridge'
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
import { LayerZeroConfigPlugin } from './layerzero/layerzero.config'
import { LayerZeroV1Plugin } from './layerzero/layerzero-v1.plugin'
import { LayerZeroV2Plugin } from './layerzero/layerzero-v2.plugin'
import { LayerZeroV2OFTsPlugin } from './layerzero/layerzero-v2-ofts.plugin'
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
import type { InteropPlugin } from './types'
import { WormholePlugin } from './wormhole'
import { WormholeNTTPlugin } from './wormhole-ntt'
import { WormholeRelayerPlugin } from './wormhole-relayer'
import { WormholeTokenBridgePlugin } from './wormhole-token-bridge'

export interface InteropPlugins {
  comparePlugins: InteropComparePlugin[]
  configPlugins: InteropConfigPlugin[]
  eventPlugins: InteropPlugin[]
}

export interface InteropPluginDependencies {
  chains: { name: string; id: number }[]
  httpClient: HttpClient
  rpcClients: RpcClient[]
  logger: Logger
  configs: InteropConfigStore
}

export function createInteropPlugins(
  deps: InteropPluginDependencies,
): InteropPlugins {
  const ethereumRpc = deps.rpcClients.find((c) => c.chain === 'ethereum')
  assert(ethereumRpc)

  return {
    comparePlugins: [new AcrossComparePlugin()],
    configPlugins: [
      new AcrossConfigPlugin(
        deps.chains,
        deps.configs,
        deps.logger,
        ethereumRpc,
      ),
      new LayerZeroConfigPlugin(
        deps.chains,
        deps.configs,
        deps.logger,
        deps.httpClient,
      ),
    ],
    eventPlugins: [
      new SquidCoralPlugin(),
      new DeBridgePlugin(),
      new DeBridgeDlnPlugin(),
      new MayanForwarderPlugin(),
      new CircleGatewayPlugIn(),
      new CCIPPlugIn(),
      new MayanSwiftPlugin(), // should be run before CCTP
      new MayanMctpPlugin(), // should be run before CCTP
      new MayanMctpFastPlugin(), // should be run before CCTP
      new CCTPPlugin(),
      new StargatePlugin(), // should be run before stargate bus/taxi, ofts
      new StargateV2BusPlugin(), // should be run before LayerZeroV2, ofts
      new StargateV2TaxiPlugin(), // should be run before LayerZeroV2, ofts
      new LayerZeroV2OFTsPlugin(), // should be run before LayerZeroV2
      new LayerZeroV1Plugin(),
      new LayerZeroV2Plugin(),
      new WormholeNTTPlugin(), // should be run before WormholeCore and WormholeRelayer
      new WormholeTokenBridgePlugin(), // should be run before Wormhole
      new WormholeRelayerPlugin(), // should be run before Wormhole
      new WormholePlugin(),
      new AllbridgePlugIn(),
      new AxelarITSPlugin(), // should be run before Axelar
      new AxelarPlugin(),
      new AcrossPlugin(deps.configs),
      new OrbitStackPlugin(),
      new OpStackPlugin(),
      new HyperlaneMerklyTokenBridgePlugin(), // should be run before HyperlaneHWR
      new HyperlaneHwrPlugin(), // should be run before Hyperlane
      new HyperlaneEcoPlugin(), // should be run before Hyperlane
      new HyperlanePlugIn(),
      new OneinchFusionPlusPlugin(),
    ],
  }
}
