import { mkdirSync } from 'fs'
import path from 'path'
import {
  AllProviders,
  type DiscoveryCache,
  type DiscoveryChainConfig,
  type IProvider,
  NoCache,
  SQLiteCache,
  getMulticall3Config,
} from '@l2beat/discovery'
import type { ExplorerConfig } from '@l2beat/discovery/dist/utils/IEtherscanClient'
import { HttpClient } from '@l2beat/shared'
import { readConfig } from '../../config/readConfig'

const UNKNOWN_CHAIN_NAME = 'UnknownChainName'

export async function getProvider(
  rpcUrl: string,
  explorer?: ExplorerConfig,
): Promise<IProvider> {
  const httpClient = new HttpClient()
  let cache: DiscoveryCache = new NoCache()
  const config = readConfig()
  if (config.projectRootPath !== undefined) {
    const cacheDir = path.join(config.projectRootPath, 'cache')
    mkdirSync(cacheDir, { recursive: true }) // Make sure the cache directory exists
    const globalCachePath = path.join(cacheDir, 'l2b.sqlite')
    cache = new SQLiteCache(globalCachePath)
  }

  const chainConfigs: DiscoveryChainConfig[] = [
    {
      name: UNKNOWN_CHAIN_NAME,
      rpcUrl,
      multicall: getMulticall3Config(Number.MAX_SAFE_INTEGER),
      explorer: explorer ?? {
        type: 'etherscan',
        url: 'ERROR',
        apiKey: 'ERROR',
      },
    },
  ]

  const allProviders = new AllProviders(chainConfigs, httpClient, cache)
  const blockNumber =
    await allProviders.getLatestBlockNumber(UNKNOWN_CHAIN_NAME)
  return allProviders.get(UNKNOWN_CHAIN_NAME, blockNumber)
}
