import type { Logger } from '@l2beat/backend-tools'
import type { HttpClient, IRpcClient } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import type { TokenDbClient } from '@l2beat/token-backend'
import type { InteropComparePlugin } from '../engine/compare/InteropCompareLoop'
import type {
  InteropConfigPlugin,
  InteropConfigStore,
} from '../engine/config/InteropConfigStore'
import { OneinchFusionPlusPlugin } from './1inchfusionplus'
import { AcrossComparePlugin } from './across/across.compare'
import { AcrossConfigPlugin } from './across/across.config'
import { AcrossPlugin } from './across/across.plugin'
import { AcrossSettlementOpPlugin } from './across-settlement-op'
import { AcrossSettlementOrbitPlugin } from './across-settlement-orbit'
import { AgglayerPlugin } from './agglayer'
import { AllbridgePlugIn } from './allbridge'
import { AxelarPlugin } from './axelar'
import { AxelarITSPlugin } from './axelar-its'
import { BeefyBridgePlugin } from './beefy-bridge'
import { CCIPConfigPlugin } from './ccip/ccip.config'
import { CCIPPlugin } from './ccip/ccip.plugin'
import { CCTPConfigPlugin } from './cctp/cctp.config'
import { CCTPV1Plugin } from './cctp/cctp-v1.plugin'
import { CCTPV2Plugin } from './cctp/cctp-v2.plugin'
import { CelerPlugIn } from './celer'
import { CentriFugePlugin } from './centrifuge'
import { CircleGatewayPlugIn } from './circle-gateway'
import { DeBridgePlugin } from './debridge'
import { DeBridgeDlnPlugin } from './debridge-dln'
import { GasZipPlugin } from './gaszip/gaszip.plugin'
import { HyperlanePlugIn } from './hyperlane'
import { HyperlaneEcoPlugin } from './hyperlane-eco'
import { HyperlaneHwrPlugin } from './hyperlane-hwr'
import { HyperlaneMerklyTokenBridgePlugin } from './hyperlane-merkly-tokenbridge'
import { HyperlaneSimpleAppsPlugIn } from './hyperlane-simple-apps'
import { LayerZeroConfigPlugin } from './layerzero/layerzero.config'
import { LayerZeroV1Plugin } from './layerzero/layerzero-v1.plugin'
import { LayerZeroV2Plugin } from './layerzero/layerzero-v2.plugin'
import { LayerZeroV2OFTsPlugin } from './layerzero/layerzero-v2-ofts.plugin'
import { LidoWstethPlugin } from './lido-wsteth'
import { MakerBridgePlugin } from './maker-bridge'
import { MayanForwarderPlugin } from './mayan-forwarder'
import { MayanMctpPlugin } from './mayan-mctp'
import { MayanMctpFastPlugin } from './mayan-mctp-fast'
import { MayanSwiftPlugin } from './mayan-swift'
import { MayanSwiftSettlementPlugin } from './mayan-swift-settlement'
import { MesonPlugin } from './meson'
import { OpStackPlugin } from './opstack/opstack'
import { OpStackStandardBridgePlugin } from './opstack/opstack-standardbridge'
import { OrbitStackPlugin } from './orbitstack/orbitstack'
import { OrbitStackCustomGatewayPlugin } from './orbitstack/orbitstack-customgateway'
import { OrbitStackStandardGatewayPlugin } from './orbitstack/orbitstack-standardgateway'
import { OrbitStackWethGatewayPlugin } from './orbitstack/orbitstack-wethgateway'
import { PolygonConfigPlugin } from './polygon/polygon.config'
import { PolygonPlugin } from './polygon/polygon.plugin'
import { RelayPlugin } from './relay/relay.plugin'
import { SkyBridgePlugin } from './sky-bridge'
import { SorareBasePlugin } from './sorare-base'
import { SquidCoralPlugin } from './squid-coral'
import { StargatePlugin } from './stargate'
import type { InteropPlugin } from './types'
import { WorldIdPlugin } from './world-id'
import { WormholeConfigPlugin } from './wormhole/wormhole.config'
import { WormholePlugin } from './wormhole/wormhole.plugin'
import { WormholeNTTPlugin } from './wormhole-ntt'
import { WormholeRelayerPlugin } from './wormhole-relayer'
import { WormholeTokenBridgePlugin } from './wormhole-token-bridge'
import { ZklinkNovaPlugin } from './zklink-nova'
import { ZkStackConfigPlugin } from './zkstack/zkstack.config'

export interface PluginCluster {
  name: string
  plugins: InteropPlugin[]
}

import { ZkStackPlugin } from './zkstack/zkstack.plugin'

export interface InteropPlugins {
  comparePlugins: InteropComparePlugin[]
  configPlugins: InteropConfigPlugin[]
  eventPlugins: (InteropPlugin | PluginCluster)[]
}

export interface InteropPluginDependencies {
  chains: { name: string; id: number }[]
  httpClient: HttpClient
  rpcClients: IRpcClient[]
  logger: Logger
  configs: InteropConfigStore
  tokenDbClient: TokenDbClient
}

export function createInteropPlugins(
  deps: InteropPluginDependencies,
): InteropPlugins {
  const ethereumRpc = deps.rpcClients.find((c) => c.chain === 'ethereum')
  assert(ethereumRpc)
  const rpcs = new Map(deps.rpcClients.map((r) => [r.chain, r]))
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
      new CCTPConfigPlugin(deps.chains, deps.configs, deps.logger, rpcs),
      new WormholeConfigPlugin(
        deps.chains,
        deps.configs,
        deps.logger,
        deps.httpClient,
        rpcs,
      ),
      new CCIPConfigPlugin(
        deps.chains,
        deps.configs,
        deps.logger,
        deps.httpClient,
      ),
      new ZkStackConfigPlugin(
        deps.configs,
        deps.logger,
        rpcs,
        deps.tokenDbClient,
      ),
      new PolygonConfigPlugin(deps.configs, deps.logger, rpcs),
    ],
    eventPlugins: [
      new SquidCoralPlugin(),
      new DeBridgePlugin(),
      new DeBridgeDlnPlugin(),
      new AgglayerPlugin(),
      new CircleGatewayPlugIn(deps.configs),
      new CelerPlugIn(),
      new MesonPlugin(),
      new CCIPPlugin(deps.configs),
      new CentriFugePlugin(),
      {
        name: 'layerzero',
        plugins: [
          new StargatePlugin(deps.configs), // should be run before ofts, lzv2
          new LayerZeroV2OFTsPlugin(deps.configs), // should be run before LayerZeroV2
          new LayerZeroV2Plugin(deps.configs),
          new LayerZeroV1Plugin(deps.configs),
        ],
      },
      {
        name: 'wormhole',
        plugins: [
          // Mayan plugins (use both Wormhole messaging and CCTP for transfers)
          new MayanForwarderPlugin(deps.configs), // should be run before MayanSwift
          new MayanSwiftPlugin(deps.configs), // should be run before CCTP
          new MayanSwiftSettlementPlugin(deps.configs), // should be run after MayanSwiftPlugin
          new MayanMctpPlugin(), // should be run before CCTP
          new MayanMctpFastPlugin(deps.configs), // should be run before CCTP
          // Wormhole-specific plugins
          new WormholeNTTPlugin(deps.configs), // should be run before WormholeCore and WormholeRelayer
          new WormholeTokenBridgePlugin(deps.configs), // should be run before Wormhole
          new WormholeRelayerPlugin(deps.configs), // should be run before Wormhole
          // CCTP plugins (Circle's cross-chain USDC)
          new CCTPV1Plugin(deps.configs),
          new CCTPV2Plugin(deps.configs),
          // Core Wormhole messaging (most generic, runs last)
          new WormholePlugin(deps.configs),
        ],
      },
      new AllbridgePlugIn(),
      {
        name: 'axelar',
        plugins: [
          new AxelarITSPlugin(), // should be run before Axelar
          new AxelarPlugin(),
        ],
      },
      new AcrossPlugin(deps.configs),
      {
        name: 'orbitstack',
        plugins: [
          new AcrossSettlementOrbitPlugin(), // should be run before OrbitStack
          new OrbitStackWethGatewayPlugin(), // should be run before OrbitStackStandardGateway and OrbitStack
          new OrbitStackStandardGatewayPlugin(), // should be run before OrbitStack
          new OrbitStackCustomGatewayPlugin(), // should be run before OrbitStack
          new OrbitStackPlugin(),
        ],
      },
      {
        name: 'opstack',
        plugins: [
          new AcrossSettlementOpPlugin(), // should be run before OpStack
          new ZklinkNovaPlugin(), // should be run before OpStack
          new WorldIdPlugin(), // should be run before OpStack
          new LidoWstethPlugin(), // should be run before OpStack
          new SorareBasePlugin(), // should be run before OpStackStandardBridge
          new BeefyBridgePlugin(), // should be run before OpStackStandardBridge
          new MakerBridgePlugin(), // should be run before OpStackStandardBridge
          new SkyBridgePlugin(), // should be run before OpStackStandardBridge
          new OpStackStandardBridgePlugin(), // should be run before OpStack
          new OpStackPlugin(),
        ],
      },
      {
        name: 'hyperlane',
        plugins: [
          new HyperlaneMerklyTokenBridgePlugin(), // should be run before HyperlaneHWR
          new HyperlaneHwrPlugin(), // should be run before Hyperlane
          new HyperlaneEcoPlugin(), // should be run before Hyperlane
          new HyperlaneSimpleAppsPlugIn(), // should be run before Hyperlane
          new HyperlanePlugIn(),
        ],
      },
      new OneinchFusionPlusPlugin(),
      new RelayPlugin(),
      new GasZipPlugin(deps.logger),
      new PolygonPlugin(deps.configs),
      new ZkStackPlugin(deps.configs),
    ],
  }
}

export function flattenClusters(
  plugins: (InteropPlugin | PluginCluster)[],
): InteropPlugin[] {
  return plugins.flatMap((p) => ('plugins' in p ? p.plugins : p))
}

export function pluginsAsClusters(
  plugins: (InteropPlugin | PluginCluster)[],
): PluginCluster[] {
  return plugins.map((p) =>
    'plugins' in p ? p : { name: p.name, plugins: [p] },
  )
}
