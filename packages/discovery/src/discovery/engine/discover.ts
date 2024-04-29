import { AddressAnalyzer, Analysis } from '../analysis/AddressAnalyzer'
import { DiscoveryConfig } from '../config/DiscoveryConfig'
import { DiscoveryLogger } from '../DiscoveryLogger'
import { HandlerExecutor } from '../handlers/HandlerExecutor'
import { DiscoveryProvider } from '../provider/DiscoveryProvider'
import { MulticallClient } from '../provider/multicall/MulticallClient'
import { MulticallConfig } from '../provider/multicall/types'
import { ProxyDetector } from '../proxies/ProxyDetector'
import { SourceCodeService } from '../source/SourceCodeService'
import { DiscoveryEngine } from './DiscoveryEngine'

export async function discover(
  provider: DiscoveryProvider,
  config: DiscoveryConfig,
  multicallConfig: MulticallConfig,
  logger: DiscoveryLogger,
  blockNumber: number,
): Promise<Analysis[]> {
  const proxyDetector = new ProxyDetector(provider, logger)
  const sourceCodeService = new SourceCodeService(provider)
  const multicallClient = new MulticallClient(provider, multicallConfig)
  const handlerExecutor = new HandlerExecutor(provider, multicallClient, logger)
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
