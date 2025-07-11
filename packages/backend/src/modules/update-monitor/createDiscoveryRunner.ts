import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import {
  type DiscoveryChainConfig,
  type DiscoveryPaths,
  getDiscoveryEngine,
  type DiscoveryCache as IDiscoveryCache,
  InMemoryCache,
  LeveledCache,
  TemplateService,
} from '@l2beat/discovery'
import type { HttpClient } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import type { Peripherals } from '../../peripherals/Peripherals'
import { DatabaseCache } from './DatabaseCache'
import { DiscoveryRunner } from './DiscoveryRunner'
import { RedisCache } from './RedisCache'

export function createDiscoveryRunner(
  paths: DiscoveryPaths,
  http: HttpClient,
  peripherals: Peripherals,
  discoveryLogger: Logger,
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

  const templateService = new TemplateService(paths.discovery)
  return new DiscoveryRunner(
    allProviders,
    discoveryEngine,
    templateService,
    chain,
  )
}

function decodeCacheUri(uri: string, database: Database): IDiscoveryCache {
  if (uri === 'postgres') {
    return new DatabaseCache(database)
  }
  if (uri.startsWith('redis')) {
    return new RedisCache(uri)
  }
  assert(false, 'unsupported cache URI')
}
