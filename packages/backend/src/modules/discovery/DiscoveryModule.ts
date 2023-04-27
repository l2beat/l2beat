import { HttpClient, Logger, MainnetEtherscanClient } from '@l2beat/shared'
import { providers } from 'ethers'

import { Config } from '../../config'
import { Clock } from '../../core/Clock'
import { AddressAnalyzer } from '../../core/discovery/analysis/AddressAnalyzer'
import { ConfigReader } from '../../core/discovery/config/ConfigReader'
import { DiscoveryLogger } from '../../core/discovery/DiscoveryLogger'
import { DiscoveryRunner } from '../../core/discovery/DiscoveryRunner'
import { DiscoveryEngine } from '../../core/discovery/engine/DiscoveryEngine'
import { HandlerExecutor } from '../../core/discovery/handlers/HandlerExecutor'
import { DiscoveryProvider } from '../../core/discovery/provider/DiscoveryProvider'
import { ProxyDetector } from '../../core/discovery/proxies/ProxyDetector'
import { SourceCodeService } from '../../core/discovery/source/SourceCodeService'
import { UpdateMonitor } from '../../core/discovery/UpdateMonitor'
import { UpdateMonitorRepository } from '../../peripherals/database/discovery/UpdateMonitorRepository'
import { Database } from '../../peripherals/database/shared/Database'
import { DiscordClient } from '../../peripherals/discord/DiscordClient'
import { ApplicationModule } from '../ApplicationModule'

export function createDiscoveryModule(
  config: Config,
  logger: Logger,
  http: HttpClient,
  database: Database,
  clock: Clock,
): ApplicationModule | undefined {
  if (!config.discoveryWatcher) {
    logger.info('Discovery Watcher module disabled')
    return
  }

  const provider = new providers.AlchemyProvider(
    'mainnet',
    config.discoveryWatcher.alchemyApiKey,
  )
  const etherscanClient = new MainnetEtherscanClient(
    http,
    config.discoveryWatcher.etherscanApiKey,
  )
  const discoveryProvider = new DiscoveryProvider(provider, etherscanClient)

  const discordClient = config.discoveryWatcher.discord
    ? new DiscordClient(
        http,
        config.discoveryWatcher.discord.token,
        config.discoveryWatcher.discord.publicChannelId,
        config.discoveryWatcher.discord.internalChannelId,
      )
    : undefined

  const configReader = new ConfigReader()

  const discoveryWatcherRepository = new UpdateMonitorRepository(
    database,
    logger,
  )

  const discoveryLogger = DiscoveryLogger.SILENT

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
  const discoveryRunner = new DiscoveryRunner(discoveryEngine)

  const updateMonitor = new UpdateMonitor(
    provider,
    discoveryRunner,
    discordClient,
    configReader,
    discoveryWatcherRepository,
    clock,
    logger,
    !!config.discoveryWatcher.runOnStart,
  )

  const start = async () => {
    logger = logger.for('DiscoveryWatcherModule')
    logger.info('Starting')

    await updateMonitor.start()
  }

  return {
    routers: [],
    start,
  }
}
