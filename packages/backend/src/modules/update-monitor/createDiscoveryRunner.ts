import {
  type DiscoveryChainConfig,
  type DiscoveryLogger,
  type DiscoveryPaths,
  type DiscoveryCache as IDiscoveryCache,
  InMemoryCache,
  LeveledCache,
  RedisCache,
  getDiscoveryEngine,
} from '@l2beat/discovery'

import type { Database } from '@l2beat/database'
import type { HttpClient } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import type { Peripherals } from '../../peripherals/Peripherals'
import { DiscoveryCache } from './DiscoveryCache'
import { DiscoveryRunner } from './DiscoveryRunner'

export function createDiscoveryRunner(
  paths: DiscoveryPaths,
  http: HttpClient,
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
    paths,
    chainConfigs,
    discoveryCache,
    http,
    discoveryLogger,
    chain,
  )

  return new DiscoveryRunner(allProviders, discoveryEngine, chain)
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
