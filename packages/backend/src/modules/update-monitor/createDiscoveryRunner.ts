import {
  ConfigReader,
  DiscoveryChainConfig,
  DiscoveryLogger,
  DiscoveryCache as IDiscoveryCache,
  InMemoryCache,
  LeveledCache,
  RedisCache,
  getDiscoveryEngine,
} from '@l2beat/discovery'

import { Database } from '@l2beat/database'
import { HttpClient } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import { Peripherals } from '../../peripherals/Peripherals'
import { DiscoveryCache } from './DiscoveryCache'
import { DiscoveryRunner } from './DiscoveryRunner'

export function createDiscoveryRunner(
  http: HttpClient,
  configReader: ConfigReader,
  peripherals: Peripherals,
  discoveryLogger: DiscoveryLogger,
  chainConfigs: DiscoveryChainConfig[],
  chain: string,
  cacheEnabled: boolean,
  cacheUri: string,
) {
  let discoveryCache: IDiscoveryCache = {
    get: async () => undefined,
    set: async () => {},
  }

  if (cacheEnabled) {
    const l1Cache = new InMemoryCache(5000)
    const l2Cache = decodeCacheUri(cacheUri, peripherals.database)
    discoveryCache = new LeveledCache(l1Cache, l2Cache)
  }

  const { allProviders, discoveryEngine } = getDiscoveryEngine(
    chainConfigs,
    discoveryCache,
    http,
    discoveryLogger,
    chain,
  )

  return new DiscoveryRunner(allProviders, discoveryEngine, configReader, chain)
}

function decodeCacheUri(uri: string, database: Database): IDiscoveryCache {
  if (uri === 'postgres') {
    return new DiscoveryCache(database)
  } else if (uri.startsWith('redis')) {
    return new RedisCache(uri)
  } else {
    assert(false, 'unsupported cache URI')
  }
}
