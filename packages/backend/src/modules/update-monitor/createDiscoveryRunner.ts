import {
  AddressAnalyzer,
  ConfigReader,
  DiscoveryEngine,
  DiscoveryLogger,
  DiscoveryProvider,
  EtherscanLikeClient,
  HandlerExecutor,
  HttpClient,
  MulticallClient,
  ProviderWithCache,
  ProxyDetector,
  SourceCodeService,
  TemplateService,
} from '@l2beat/discovery'
import { providers } from 'ethers'

import { UpdateMonitorChainConfig } from '../../config/Config'
import { Peripherals } from '../../peripherals/Peripherals'
import { DiscoveryCache } from './DiscoveryCache'
import { DiscoveryRunner } from './DiscoveryRunner'
import { DiscoveryCacheRepository } from './repositories/DiscoveryCacheRepository'

export function createDiscoveryRunner(
  http: HttpClient,
  configReader: ConfigReader,
  peripherals: Peripherals,
  discoveryLogger: DiscoveryLogger,
  chainConfig: UpdateMonitorChainConfig,
) {
  const discoveryProvider = getDiscoveryProvider(
    http,
    discoveryLogger,
    peripherals,
    chainConfig,
  )

  const proxyDetector = new ProxyDetector(discoveryProvider, discoveryLogger)
  const sourceCodeService = new SourceCodeService(discoveryProvider)
  const multicallClient = new MulticallClient(
    discoveryProvider,
    chainConfig.multicall,
  )
  const handlerExecutor = new HandlerExecutor(
    discoveryProvider,
    multicallClient,
    discoveryLogger,
  )
  const templateService = new TemplateService()
  const addressAnalyzer = new AddressAnalyzer(
    discoveryProvider,
    proxyDetector,
    sourceCodeService,
    handlerExecutor,
    templateService,
    discoveryLogger,
  )
  const discoveryEngine = new DiscoveryEngine(addressAnalyzer, discoveryLogger)
  const discoveryRunner = new DiscoveryRunner(
    discoveryProvider,
    discoveryEngine,
    configReader,
    chainConfig.name,
  )

  return discoveryRunner
}

function getDiscoveryProvider(
  http: HttpClient,
  discoveryLogger: DiscoveryLogger,
  peripherals: Peripherals,
  chainConfig: UpdateMonitorChainConfig,
) {
  const provider = new providers.StaticJsonRpcProvider(chainConfig.rpcUrl)
  const eventProvider =
    chainConfig.eventRpcUrl === undefined
      ? provider
      : new providers.StaticJsonRpcProvider(chainConfig.eventRpcUrl)
  const etherscanLikeClient = EtherscanLikeClient.createForDiscovery(
    http,
    chainConfig.etherscanUrl,
    chainConfig.etherscanApiKey,
    chainConfig.etherscanUnsupported,
  )

  if (chainConfig.enableCache) {
    const discoveryCacheRepository = peripherals.getRepository(
      DiscoveryCacheRepository,
    )
    const discoveryCache = new DiscoveryCache(discoveryCacheRepository)
    return new ProviderWithCache(
      provider,
      eventProvider,
      etherscanLikeClient,
      discoveryLogger,
      chainConfig.name,
      discoveryCache,
      chainConfig.rpcGetLogsMaxRange,
      chainConfig.reorgSafeDepth,
    )
  }

  return new DiscoveryProvider(
    provider,
    eventProvider,
    etherscanLikeClient,
    discoveryLogger,
    chainConfig.rpcGetLogsMaxRange,
  )
}
