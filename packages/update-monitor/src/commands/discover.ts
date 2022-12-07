import {
  AddressAnalyzer,
  HttpClient,
  MainnetEtherscanClient,
} from '@l2beat/common'
import { providers } from 'ethers'

import { DiscoveryEngine } from '../discovery/DiscoveryEngine'
import {
  ACROSS_BRIDGE_NAME,
  discoverAcrossBridge,
} from '../projects/acrossBridge'
import { APTOS_NAME, discoverAptos } from '../projects/aptosBridge'
import { ARBITRUM_NAME, discoverArbitrum } from '../projects/arbitrum'
import { CBRIDGE_NAME, discoverCBridge } from '../projects/cBridge'
import {
  CONNEXT_BRIDGE_NAME,
  discoverConnextBridge,
} from '../projects/connextBridge'
import { discoverDydx, DYDX_NAME } from '../projects/dYdX'
import { discoverHop, HOP_NAME } from '../projects/hop'
import {
  discoverHyphenBridge,
  HYPHEN_BRIDGE_NAME,
} from '../projects/hyphenBridge'
import {
  discoverLayer2FinanceZk,
  L2FZK_NAME,
} from '../projects/layer2FinanceZk'
import { discoverLoopring, LOOPRING_NAME } from '../projects/loopring'
import { discoverMetis, METIS_NAME } from '../projects/metis'
import { discoverNova, NOVA_NAME } from '../projects/nova'
import { discoverOmgNetwork, OMG_NETWORK_NAME } from '../projects/omgNetwork'
import { discoverOptimism, OPTIMISM_NAME } from '../projects/optimism'
import { discoverOrbitBridge, ORBIT_BRIDGE_NAME } from '../projects/orbitBridge'
import {
  discoverPolynetworkBridge,
  POLYNETWORK_BRIDGE_NAME,
} from '../projects/polynetworkBridge'
import {
  discoverSolletBridge,
  SOLLET_BRIDGE_NAME,
} from '../projects/solletBridge'
import { discoverStarkNet, STARK_NET_NAME } from '../projects/starknet'
import { discoverSynapse, SYNAPSE_NAME } from '../projects/synapse'
import { discoverZkSpace, ZK_SPACE_NAME } from '../projects/zkSpace'
import { discoverZkSwap1, ZK_SWAP_1_NAME } from '../projects/zkSwap1'
import { discoverZkSwap2, ZK_SWAP_2_NAME } from '../projects/zkSwap2'
import { discoverZkSync, ZK_SYNC_NAME } from '../projects/zkSync'
import { getEnv } from './getEnv'
import { exitWithUsage } from './usage'

type Discover = (discoveryEngine: DiscoveryEngine) => Promise<void>

export async function discover(args: string[]) {
  const provider = new providers.AlchemyProvider(
    'mainnet',
    getEnv('ALCHEMY_API_KEY'),
  )
  const httpClient = new HttpClient()
  const etherscanClient = new MainnetEtherscanClient(
    httpClient,
    getEnv('ETHERSCAN_API_KEY'),
  )
  const addressAnalyzer = new AddressAnalyzer(provider, etherscanClient)
  const discoveryEngine = new DiscoveryEngine(provider, addressAnalyzer)

  if (args.length !== 1) {
    exitWithUsage('Invalid number of arguments')
  }

  const projects: [string, Discover][] = [
    [APTOS_NAME, discoverAptos],
    [ZK_SYNC_NAME, discoverZkSync],
    [ZK_SWAP_1_NAME, discoverZkSwap1],
    [ZK_SWAP_2_NAME, discoverZkSwap2],
    [ZK_SPACE_NAME, discoverZkSpace],
    [ARBITRUM_NAME, discoverArbitrum],
    [OPTIMISM_NAME, discoverOptimism],
    [METIS_NAME, discoverMetis],
    [LOOPRING_NAME, discoverLoopring],
    [STARK_NET_NAME, discoverStarkNet],
    [NOVA_NAME, discoverNova],
    [HOP_NAME, discoverHop],
    [DYDX_NAME, discoverDydx],
    [POLYNETWORK_BRIDGE_NAME, discoverPolynetworkBridge],
    [SOLLET_BRIDGE_NAME, discoverSolletBridge],
    [ORBIT_BRIDGE_NAME, discoverOrbitBridge],
    [SYNAPSE_NAME, discoverSynapse],
    [CBRIDGE_NAME, discoverCBridge],
    [OMG_NETWORK_NAME, discoverOmgNetwork],
    [L2FZK_NAME, discoverLayer2FinanceZk],
    [ACROSS_BRIDGE_NAME, discoverAcrossBridge],
    [HYPHEN_BRIDGE_NAME, discoverHyphenBridge],
    [CONNEXT_BRIDGE_NAME, discoverConnextBridge],
  ]

  const project = projects.find((x) => x[0] === args[0])
  if (!project) {
    exitWithUsage(`Invalid argument ${args[0]}`)
  }
  await project[1](discoveryEngine)
}
