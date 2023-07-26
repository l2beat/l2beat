import {
  AddressAnalyzer,
  ConfigReader,
  DiscoveryEngine,
  DiscoveryLogger,
  DiscoveryProvider,
  HandlerExecutor,
  ProxyDetector,
  SourceCodeService,
} from '@l2beat/discovery'
import { EtherscanLikeClient, HttpClient } from '@l2beat/shared'
import { ChainId, UnixTime } from '@l2beat/shared-pure'
import { providers } from 'ethers'

import { DiscoveryRunner } from '../../core/discovery/DiscoveryRunner'

export interface DiscoveryRunnerConfig {
  chainId: ChainId
  etherscanLikeApiUrl: string
  etherscanLikeApiKey: string
  rpcUrl: string
  minBlockTimestamp: UnixTime
}

export function createDiscoveryRunner(
  config: DiscoveryRunnerConfig,
  http: HttpClient,
  configReader: ConfigReader,
  discoveryLogger: DiscoveryLogger,
) {
  const provider = new providers.StaticJsonRpcProvider(config.rpcUrl)
  const etherscanLikeClient = new EtherscanLikeClient(
    http,
    config.etherscanLikeApiUrl,
    config.etherscanLikeApiKey,
    config.minBlockTimestamp,
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
    discoveryEngine,
    configReader,
    config.chainId,
  )

  return discoveryRunner
}
