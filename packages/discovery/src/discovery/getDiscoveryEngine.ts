import type { HttpClient } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import type { DiscoveryChainConfig } from '../config/types'
import type { DiscoveryLogger } from './DiscoveryLogger'
import { AddressAnalyzer } from './analysis/AddressAnalyzer'
import { TemplateService } from './analysis/TemplateService'
import { DiscoveryEngine } from './engine/DiscoveryEngine'
import { HandlerExecutor } from './handlers/HandlerExecutor'
import { AllProviders } from './provider/AllProviders'
import type { DiscoveryCache } from './provider/DiscoveryCache'
import { ProxyDetector } from './proxies/ProxyDetector'
import { SourceCodeService } from './source/SourceCodeService'

export function getDiscoveryEngine(
  discoveryPath: string,
  chainConfigs: DiscoveryChainConfig[],
  cache: DiscoveryCache,
  http: HttpClient,
  logger: DiscoveryLogger,
  chain: string,
) {
  const config = chainConfigs.find((c) => c.name === chain)
  assert(config !== undefined, `Unknown chain: ${chain}`)

  const allProviders = new AllProviders(chainConfigs, http, cache)

  const proxyDetector = new ProxyDetector()
  const sourceCodeService = new SourceCodeService()
  const handlerExecutor = new HandlerExecutor()
  const templateService = new TemplateService(discoveryPath)
  const addressAnalyzer = new AddressAnalyzer(
    proxyDetector,
    sourceCodeService,
    handlerExecutor,
    templateService,
  )

  const discoveryEngine = new DiscoveryEngine(addressAnalyzer, logger)
  return {
    allProviders,
    discoveryEngine,
  }
}
