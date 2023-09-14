import {
  AddressAnalyzer,
  ConfigReader,
  DiscoveryEngine,
  DiscoveryLogger,
  DiscoveryProvider,
  EtherscanLikeClient,
  HandlerExecutor,
  HttpClient,
  ProxyDetector,
  SourceCodeService,
} from '@l2beat/discovery'
import { providers } from 'ethers'

import { UpdateMonitorChainConfig } from '../../config/Config'
import { DiscoveryRunner } from './DiscoveryRunner'

export function createDiscoveryRunner(
  http: HttpClient,
  configReader: ConfigReader,
  discoveryLogger: DiscoveryLogger,
  chainConfig: UpdateMonitorChainConfig,
) {
  const provider = new providers.StaticJsonRpcProvider(chainConfig.rpcUrl)
  const etherscanLikeClient = EtherscanLikeClient.createForDiscovery(
    http,
    chainConfig.etherscanUrl,
    chainConfig.etherscanApiKey,
  )

  const discoveryProvider = new DiscoveryProvider(provider, etherscanLikeClient)

  const proxyDetector = new ProxyDetector(discoveryProvider, discoveryLogger)
  const sourceCodeService = new SourceCodeService(discoveryProvider)
  const handlerExecutor = new HandlerExecutor(
    discoveryProvider,
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
