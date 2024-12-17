import {
  ConfigReader,
  DiscoveryChainConfig,
  DiscoveryLogger,
  DiscoveryCache as IDiscoveryCache,
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
  let discoveryCache: IDiscoveryCache = new DiscoveryCache(peripherals.database)
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
