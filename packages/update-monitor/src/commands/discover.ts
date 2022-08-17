import {
  AddressAnalyzer,
  HttpClient,
  MainnetEtherscanClient,
} from '@l2beat/common'
import { providers } from 'ethers'

import { DiscoveryEngine } from '../discovery/DiscoveryEngine'
import { ARBITRUM_NAME, discoverArbitrum } from '../projects/arbitrum'
import { discoverDydx, DYDX_NAME } from '../projects/dYdX'
import { discoverNova, NOVA_NAME } from '../projects/nova'
import { discoverStarkNet, STARK_NET_NAME } from '../projects/starknet'
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
    [ZK_SYNC_NAME, discoverZkSync],
    [ZK_SWAP_1_NAME, discoverZkSwap1],
    [ZK_SWAP_2_NAME, discoverZkSwap2],
    [ZK_SPACE_NAME, discoverZkSpace],
    [ARBITRUM_NAME, discoverArbitrum],
    [STARK_NET_NAME, discoverStarkNet],
    [NOVA_NAME, discoverNova],
    [DYDX_NAME, discoverDydx],
  ]

  const project = projects.find((x) => x[0] === args[0])
  if (!project) {
    exitWithUsage(`Invalid argument ${args[0]}`)
  }
  await project[1](discoveryEngine)
}
