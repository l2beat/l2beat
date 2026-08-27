import { Logger } from '@l2beat/backend-tools'
import {
  AllProviders,
  type DiscoveryChainConfig,
  type ExplorerConfig,
  getDiscoveryPaths,
  getMulticall3Config,
  type IProvider,
  type MulticallConfig,
  SQLiteCache,
} from '@l2beat/discovery'
import { HttpClient } from '@l2beat/shared'
import { mkdirSync } from 'fs'
import { dirname } from 'path'

const UNKNOWN_CHAIN_NAME = 'UnknownChainName'

// We cannot know when multicall3 was deployed on a chain we have no config
// for, so callers that do have one are expected to pass it in.
const MULTICALL_DISABLED = getMulticall3Config(Number.MAX_SAFE_INTEGER)

// Neither depends on the chain, and SQLiteCache opens a database handle it
// never closes, so long-running processes must not create one per call.
let sharedHttpClient: HttpClient | undefined
let sharedCache: SQLiteCache | undefined

function getHttpClient(): HttpClient {
  sharedHttpClient ??= new HttpClient()
  return sharedHttpClient
}

function getCache(): SQLiteCache {
  if (sharedCache === undefined) {
    const paths = getDiscoveryPaths()
    mkdirSync(dirname(paths.cache), { recursive: true })
    sharedCache = new SQLiteCache(paths.cache)
  }
  return sharedCache
}

export async function getProvider(
  rpcUrl: string,
  explorer?: ExplorerConfig[],
  chainName?: string,
  multicall: MulticallConfig = MULTICALL_DISABLED,
  coingeckoApiKey?: string,
): Promise<IProvider> {
  const httpClient = getHttpClient()
  const cache = getCache()

  const effectiveChainName = chainName ?? UNKNOWN_CHAIN_NAME

  const chainConfigs: DiscoveryChainConfig[] = [
    {
      name: effectiveChainName,
      rpcUrl,
      multicall,
      coingeckoApiKey,
      explorer: explorer ?? [
        {
          type: 'etherscan',
          url: 'ERROR',
          apiKey: 'ERROR',
          chainId: -1,
        },
      ],
    },
  ]

  const allProviders = new AllProviders(
    chainConfigs,
    httpClient,
    cache,
    Logger.SILENT,
  )
  const blockNumber =
    await allProviders.getLatestBlockNumber(effectiveChainName)
  return allProviders.getByBlockNumber(effectiveChainName, blockNumber)
}
