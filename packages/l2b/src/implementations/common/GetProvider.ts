import { Logger } from '@l2beat/backend-tools'
import {
  AllProviders,
  type DiscoveryChainConfig,
  type ExplorerConfig,
  getDiscoveryPaths,
  getMulticall3Config,
  type IProvider,
  SQLiteCache,
} from '@l2beat/discovery'
import { HttpClient } from '@l2beat/shared'
import { mkdirSync } from 'fs'
import { dirname } from 'path'

const UNKNOWN_CHAIN_NAME = 'UnknownChainName'

export async function getProvider(
  rpcUrl: string,
  explorer?: ExplorerConfig,
): Promise<IProvider> {
  const httpClient = new HttpClient()
  const paths = getDiscoveryPaths()
  // Make sure the cache directory exists
  mkdirSync(dirname(paths.cache), { recursive: true })
  const cache = new SQLiteCache(paths.cache)

  const chainConfigs: DiscoveryChainConfig[] = [
    {
      name: UNKNOWN_CHAIN_NAME,
      rpcUrl,
      multicall: getMulticall3Config(Number.MAX_SAFE_INTEGER),
      explorer: explorer ?? {
        type: 'etherscan',
        url: 'ERROR',
        apiKey: 'ERROR',
        chainId: -1,
      },
    },
  ]

  const allProviders = new AllProviders(
    chainConfigs,
    httpClient,
    cache,
    Logger.SILENT,
  )
  const blockNumber =
    await allProviders.getLatestBlockNumber(UNKNOWN_CHAIN_NAME)
  return allProviders.getByBlockNumber(UNKNOWN_CHAIN_NAME, blockNumber)
}
