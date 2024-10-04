import path from 'path'
import {
  AllProviders,
  DiscoveryCache,
  DiscoveryChainConfig,
  HttpClient,
  IProvider,
  NoCache,
  SQLiteCache,
  getMulticall3Config,
} from '@l2beat/discovery'
import { ExplorerConfig } from '@l2beat/discovery/dist/utils/IEtherscanClient'
import { readConfig } from '../../config/readConfig'

// NOTE(radomski): Since the assumption is that there always is a chain that
// we're working on in the IProvider abstraction and this class works on an
// rpcUrl without knowing what chain it actually is underneath we need to
// create a _virtual_ chain. Ideally the user should never try to switch the
// used chain so we can just assert that the used chain is always the magic
// one. This class is written with the assumption that it's used from a place
// that only operates on a rpcUrl. An example would be l2b - which is a cli
// application.
const MAGIC_CHAIN = 'ThisIsAMagicChainThatDoesNotExist'

export async function getProvider(
  rpcUrl: string,
  explorer: ExplorerConfig,
): Promise<IProvider> {
  const httpClient = new HttpClient()
  let cache: DiscoveryCache = new NoCache()
  const config = readConfig()
  if (config.projectRootPath !== undefined) {
    const globalCachePath = path.join(
      config.projectRootPath,
      'cache',
      'l2b.sqlite',
    )
    const sqliteCache = new SQLiteCache(globalCachePath)
    await sqliteCache.init()
    cache = sqliteCache
  }

  const chainConfigs: DiscoveryChainConfig[] = [
    {
      name: MAGIC_CHAIN,
      rpcUrl,
      multicall: getMulticall3Config(Number.MAX_SAFE_INTEGER),
      explorer: explorer,
    },
  ]

  const allProviders = new AllProviders(chainConfigs, httpClient, cache)
  const blockNumber = await allProviders.getLatestBlockNumber(MAGIC_CHAIN)
  return allProviders.get(MAGIC_CHAIN, blockNumber)
}
