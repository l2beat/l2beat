import {
  ConfigReader,
  DiscoveryChainConfig,
  DiscoveryLogger,
  HttpClient,
  DiscoveryCache as IDiscoveryCache,
  getDiscoveryEngine,
} from '@l2beat/discovery'

import { Peripherals } from '../../peripherals/Peripherals'
import { DiscoveryCache } from './DiscoveryCache'
import { DiscoveryRunner } from './DiscoveryRunner'
import { DiscoveryCacheRepository } from './repositories/DiscoveryCacheRepository'

export function createDiscoveryRunner(
  http: HttpClient,
  configReader: ConfigReader,
  peripherals: Peripherals,
  discoveryLogger: DiscoveryLogger,
  chainConfigs: DiscoveryChainConfig[],
  chain: string,
  enableCache: boolean,
) {
  const discoveryCacheRepository = peripherals.getRepository(
    DiscoveryCacheRepository,
  )
  let discoveryCache: IDiscoveryCache = new DiscoveryCache(
    discoveryCacheRepository,
  )
  if (!enableCache) {
    discoveryCache = {
      get: async () => undefined,
      set: async () => {},
    }
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
