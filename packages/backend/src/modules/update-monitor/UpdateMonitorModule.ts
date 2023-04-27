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

export function createUpdateMonitorModule(
  config: Config,
  logger: Logger,
  http: HttpClient,
  database: Database,
  clock: Clock,
): ApplicationModule | undefined {
  if (!config.updateMonitor) {
    logger.info('UpdateMonitor module disabled')
    return
  }

  const provider = new providers.AlchemyProvider(
    'mainnet',
    config.updateMonitor.alchemyApiKey,
  )
  const etherscanClient = new MainnetEtherscanClient(
    http,
    config.updateMonitor.etherscanApiKey,
  )
  const discoveryProvider = new DiscoveryProvider(provider, etherscanClient)

  const discordClient = config.updateMonitor.discord
    ? new DiscordClient(
        http,
        config.updateMonitor.discord.token,
        config.updateMonitor.discord.publicChannelId,
        config.updateMonitor.discord.internalChannelId,
      )
    : undefined

  const configReader = new ConfigReader()

  const updateMonitorRepository = new UpdateMonitorRepository(database, logger)

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
    updateMonitorRepository,
    clock,
    logger,
    !!config.updateMonitor.runOnStart,
  )

  const start = async () => {
    logger = logger.for('UpdateMonitorModule')
    logger.info('Starting')

    await updateMonitor.start()
  }

  return {
    routers: [],
    start,
  }
}
