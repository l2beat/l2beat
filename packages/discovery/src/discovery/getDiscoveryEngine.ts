import type { Logger } from '@l2beat/backend-tools'
import type { HttpClient, RpcMetricsAggregator } from '@l2beat/shared'
import type { DiscoveryChainConfig } from '../config/types'
import { AddressAnalyzer } from './analysis/AddressAnalyzer'
import { TemplateService } from './analysis/TemplateService'
import type { DiscoveryPaths } from './config/getDiscoveryPaths'
import { DiscoveryEngine } from './engine/DiscoveryEngine'
import { HandlerExecutor } from './handlers/HandlerExecutor'
import { AllProviders } from './provider/AllProviders'
import type { DiscoveryCache } from './provider/DiscoveryCache'
import { ProxyDetector } from './proxies/ProxyDetector'
import { SourceCodeService } from './source/SourceCodeService'
import {
  Templatizer,
  type TemplatizerSettings,
} from './templatizer/Templatizer'

export function getDiscoveryEngine(
  paths: DiscoveryPaths,
  chainConfigs: DiscoveryChainConfig[],
  cache: DiscoveryCache,
  http: HttpClient,
  logger: Logger,
  rpcMetricsAggregator?: RpcMetricsAggregator,
  templatizerSettings?: TemplatizerSettings,
) {
  const allProviders = new AllProviders(
    chainConfigs,
    http,
    cache,
    logger,
    rpcMetricsAggregator,
  )

  const proxyDetector = new ProxyDetector()
  const sourceCodeService = new SourceCodeService()
  const handlerExecutor = new HandlerExecutor()
  const templateService = new TemplateService(paths.discovery)
  // Shares the analyzer's TemplateService so a template it writes and
  // reloads is the one later addresses match against.
  const templatizer =
    templatizerSettings === undefined
      ? undefined
      : new Templatizer(
          templateService,
          handlerExecutor,
          templatizerSettings,
          logger.for('Templatizer'),
        )
  const addressAnalyzer = new AddressAnalyzer(
    proxyDetector,
    sourceCodeService,
    handlerExecutor,
    templateService,
    templatizer,
  )

  const discoveryEngine = new DiscoveryEngine(addressAnalyzer, logger)
  return {
    allProviders,
    discoveryEngine,
  }
}
