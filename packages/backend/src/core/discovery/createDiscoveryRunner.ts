import {
  AddressAnalyzer,
  ConfigReader,
  DiscoveryEngine,
  DiscoveryLogger,
  EtherscanLikeClient,
  HandlerExecutor,
  HttpClient,
  MulticallClient,
  ProviderWithCache,
  ProxyDetector,
  SourceCodeService,
} from '@l2beat/discovery'
import { providers } from 'ethers'

import { UpdateMonitorChainConfig } from '../../config/Config'
import { DiscoveryCacheRepository } from '../../peripherals/database/DiscoveryCacheRepository'
import { DiscoveryCache } from './DiscoveryCache'
import { DiscoveryRunner } from './DiscoveryRunner'

export function createDiscoveryRunner(
  http: HttpClient,
  configReader: ConfigReader,
  discoveryCacheRepository: DiscoveryCacheRepository,
  discoveryLogger: DiscoveryLogger,
  chainConfig: UpdateMonitorChainConfig,
) {
  const provider = new providers.StaticJsonRpcProvider(chainConfig.rpcUrl)
  const etherscanLikeClient = EtherscanLikeClient.createForDiscovery(
    http,
    chainConfig.etherscanUrl,
    chainConfig.etherscanApiKey,
    chainConfig.etherscanUnsupported,
  )

  const discoveryCache = new DiscoveryCache(discoveryCacheRepository)

  const discoveryProvider = new ProviderWithCache(
    provider,
    etherscanLikeClient,
    discoveryLogger,
    chainConfig.chain,
    discoveryCache,
    chainConfig.rpcGetLogsMaxRange,
    chainConfig.reorgSafeDepth,
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
  const addressAnalyzer = new AddressAnalyzer(
    discoveryProvider,
    proxyDetector,
    sourceCodeService,
    handlerExecutor,
    discoveryLogger,
  )
  const discoveryEngine = new DiscoveryEngine(addressAnalyzer, discoveryLogger)
  const discoveryRunner = new DiscoveryRunner(
    discoveryProvider,
    discoveryEngine,
    configReader,
    chainConfig.chainId,
  )

  return discoveryRunner
}
