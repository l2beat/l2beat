import {
  AddressAnalyzer,
  HttpClient,
  MainnetEtherscanClient,
} from '@l2beat/common'
import { providers } from 'ethers'

import { DiscoveryEngine } from './discovery/DiscoveryEngine'
import { getEnv } from './getEnv'
import { discoverArbitrum } from './projects/arbitrum'
import { discoverZkSpace } from './projects/zkSpace'
import { discoverZkSwap1 } from './projects/zkSwap1'
import { discoverZkSwap2 } from './projects/zkSwap2'
import { discoverZkSync } from './projects/zkSync'

export async function discover(projects: string[]) {
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

  function includeProject(name: string) {
    if (projects.length === 0) {
      return true
    }
    return projects.includes(name)
  }

  await Promise.all([
    includeProject('zkSync') && discoverZkSync(discoveryEngine),
    includeProject('zkSwap2') && discoverZkSwap2(discoveryEngine),
    includeProject('zkSwap1') && discoverZkSwap1(discoveryEngine),
    includeProject('zkSpace') && discoverZkSpace(discoveryEngine),
    includeProject('arbitrum') && discoverArbitrum(discoveryEngine),
  ])
}
