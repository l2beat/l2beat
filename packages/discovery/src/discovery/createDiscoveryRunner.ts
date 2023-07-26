import { EtherscanLikeClient, HttpClient } from '@l2beat/shared'
import { ChainId, UnixTime } from '@l2beat/shared-pure'
import { providers } from 'ethers'

import { AddressAnalyzer } from './analysis/AddressAnalyzer'
import { ConfigReader } from './config/ConfigReader'
import { DiscoveryLogger } from './DiscoveryLogger'
import { DiscoveryRunner } from './DiscoveryRunner'
import { DiscoveryEngine } from './engine/DiscoveryEngine'
import { HandlerExecutor } from './handlers/HandlerExecutor'
import { DiscoveryProvider } from './provider/DiscoveryProvider'
import { ProxyDetector } from './proxies/ProxyDetector'
import { SourceCodeService } from './source/SourceCodeService'

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
    discoveryProvider,
    discoveryEngine,
    configReader,
    config.chainId,
  )

  return discoveryRunner
}
