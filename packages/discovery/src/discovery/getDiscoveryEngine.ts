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
  const addressAnalyzer = createAddressAnalyzer({
    templateService: new TemplateService(paths.discovery),
    templatizerSettings,
    logger,
  })
  const discoveryEngine = new DiscoveryEngine(addressAnalyzer, logger)
  return {
    allProviders,
    discoveryEngine,
  }
}

export interface AddressAnalyzerParts {
  templateService: TemplateService
  proxyDetector?: ProxyDetector
  sourceCodeService?: SourceCodeService
  handlerExecutor?: HandlerExecutor
  /** Given only by a local CLI run with `--ai`; the backend never builds a templatizer. */
  templatizerSettings?: TemplatizerSettings
  logger: Logger
}

/**
 * The one wiring of an analyzer and its templatizer, used by discovery and
 * by the templatizer benchmark, so the benchmark measures the very code a
 * `--ai` run executes. The templatizer shares the analyzer's
 * `TemplateService` and `HandlerExecutor`: a template it writes and reloads
 * is the one later addresses match against, and its dry runs go through
 * the executor the analyzer uses.
 */
export function createAddressAnalyzer(parts: AddressAnalyzerParts) {
  const handlerExecutor = parts.handlerExecutor ?? new HandlerExecutor()
  const templatizer =
    parts.templatizerSettings === undefined
      ? undefined
      : new Templatizer(
          parts.templateService,
          handlerExecutor,
          parts.templatizerSettings,
          parts.logger.for('Templatizer'),
        )
  return new AddressAnalyzer(
    parts.proxyDetector ?? new ProxyDetector(),
    parts.sourceCodeService ?? new SourceCodeService(),
    handlerExecutor,
    parts.templateService,
    templatizer,
  )
}
