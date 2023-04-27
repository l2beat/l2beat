import { AddressAnalyzer } from '../analysis/AddressAnalyzer'
import { DiscoveryConfig } from '../config/DiscoveryConfig'
import { DiscoveryLogger } from '../DiscoveryLogger'
import { HandlerExecutor } from '../handlers/HandlerExecutor'
import { DiscoveryProvider } from '../provider/DiscoveryProvider'
import { ProxyDetector } from '../proxies/ProxyDetector'
import { SourceCodeService } from '../source/SourceCodeService'
import { DiscoveryEngine } from './DiscoveryEngine'

export async function discover(
  provider: DiscoveryProvider,
  config: DiscoveryConfig,
  logger: DiscoveryLogger,
  blockNumber: number,
) {
  const proxyDetector = new ProxyDetector(provider, logger)
  const sourceCodeService = new SourceCodeService(provider)
  const handlerExecutor = new HandlerExecutor(provider, logger)
  const addressAnalyzer = new AddressAnalyzer(
    provider,
    proxyDetector,
    sourceCodeService,
    handlerExecutor,
    logger,
  )
  const discoveryEngine = new DiscoveryEngine(addressAnalyzer, logger)
  return discoveryEngine.discover(config, blockNumber)
}
