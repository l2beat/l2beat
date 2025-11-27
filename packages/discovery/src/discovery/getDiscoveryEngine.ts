import type { Logger } from '@l2beat/backend-tools'
import type { HttpClient } from '@l2beat/shared'
import type { DiscoveryChainConfig } from '../config/types.js'
import { AddressAnalyzer } from './analysis/AddressAnalyzer.js'
import { TemplateService } from './analysis/TemplateService.js'
import type { DiscoveryPaths } from './config/getDiscoveryPaths.js'
import { DiscoveryEngine } from './engine/DiscoveryEngine.js'
import { HandlerExecutor } from './handlers/HandlerExecutor.js'
import { AllProviders } from './provider/AllProviders.js'
import type { DiscoveryCache } from './provider/DiscoveryCache.js'
import { ProxyDetector } from './proxies/ProxyDetector.js'
import { SourceCodeService } from './source/SourceCodeService.js'

export function getDiscoveryEngine(
  paths: DiscoveryPaths,
  chainConfigs: DiscoveryChainConfig[],
  cache: DiscoveryCache,
  http: HttpClient,
  logger: Logger,
) {
  const allProviders = new AllProviders(chainConfigs, http, cache, logger)

  const proxyDetector = new ProxyDetector()
  const sourceCodeService = new SourceCodeService()
  const handlerExecutor = new HandlerExecutor()
  const templateService = new TemplateService(paths.discovery)
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
