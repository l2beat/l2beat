import {
  ConfigReader,
  DiscoveryChainConfig,
  DiscoveryLogger,
  DiscoveryCache as IDiscoveryCache,
  InMemoryCache,
  LeveledCache,
  getDiscoveryEngine,
} from '@l2beat/discovery'

import { HttpClient } from '@l2beat/shared'
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
  enableCache: boolean,
) {
  let discoveryCache: IDiscoveryCache = {
    get: async () => undefined,
    set: async () => {},
  }
  if (enableCache) {
    const l1Cache = new InMemoryCache()
    const l2Cache = new DiscoveryCache(peripherals.database)
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
