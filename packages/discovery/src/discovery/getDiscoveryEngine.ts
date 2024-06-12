import { assert } from '@l2beat/shared-pure'
import { providers } from 'ethers'
import { DiscoveryChainConfig } from '../config/types'
import { EtherscanLikeClient } from '../utils/EtherscanLikeClient'
import { HttpClient } from '../utils/HttpClient'
import { DiscoveryLogger } from './DiscoveryLogger'
import { AddressAnalyzer } from './analysis/AddressAnalyzer'
import { TemplateService } from './analysis/TemplateService'
import { DiscoveryEngine } from './engine/DiscoveryEngine'
import { HandlerExecutor } from './handlers/HandlerExecutor'
import { DiscoveryCache, ProviderWithCache } from './provider/ProviderWithCache'
import { MulticallClient } from './provider/multicall/MulticallClient'
import { ProxyDetector } from './proxies/ProxyDetector'
import { SourceCodeService } from './source/SourceCodeService'

export function getDiscoveryEngine(
  chainConfigs: DiscoveryChainConfig[],
  cache: DiscoveryCache,
  http: HttpClient,
  logger: DiscoveryLogger,
  chain: string,
) {
  const config = chainConfigs.find((c) => c.name === chain)
  assert(config !== undefined, `Unknown chain: ${chain}`)

  const provider = new providers.StaticJsonRpcProvider(config.rpcUrl)
  const eventProvider =
    config.eventRpcUrl === undefined
      ? provider
      : new providers.StaticJsonRpcProvider(config.eventRpcUrl)
  const etherscanClient = EtherscanLikeClient.createForDiscovery(
    http,
    config.etherscanUrl,
    config.etherscanApiKey,
    config.etherscanUnsupported,
  )
  const discoveryProvider = new ProviderWithCache(
    provider,
    eventProvider,
    etherscanClient,
    logger,
    chain,
    cache,
  )

  const proxyDetector = new ProxyDetector(discoveryProvider, logger)
  const sourceCodeService = new SourceCodeService(discoveryProvider)
  const multicallClient = new MulticallClient(
    discoveryProvider,
    config.multicall,
  )
  const handlerExecutor = new HandlerExecutor(
    discoveryProvider,
    multicallClient,
    logger,
  )
  const templateService = new TemplateService()
  const addressAnalyzer = new AddressAnalyzer(
    discoveryProvider,
    proxyDetector,
    sourceCodeService,
    handlerExecutor,
    templateService,
    logger,
  )

  return new DiscoveryEngine(addressAnalyzer, logger)
}
