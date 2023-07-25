import {
  AddressAnalyzer,
  ConfigReader,
  DISCOVERY_LOGIC_VERSION,
  DiscoveryEngine,
  DiscoveryLogger,
  DiscoveryProvider,
  HandlerExecutor,
  ProxyDetector,
  SourceCodeService,
} from '@l2beat/discovery'
import { EtherscanClient, HttpClient, Logger } from '@l2beat/shared'
import { providers } from 'ethers'

import { Config } from '../../config'
import { Clock } from '../../core/Clock'
import { DiscoveryRunner } from '../../core/discovery/DiscoveryRunner'
import { UpdateMonitor } from '../../core/discovery/UpdateMonitor'
import { UpdateNotifier } from '../../core/discovery/UpdateNotifier'
import { UpdateMonitorRepository } from '../../peripherals/database/discovery/UpdateMonitorRepository'
import { UpdateNotifierRepository } from '../../peripherals/database/discovery/UpdateNotifierRepository'
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
  const etherscanClient = new EtherscanClient(
    http,
    config.updateMonitor.etherscanApiKey,
    config.clock.minBlockTimestamp,
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

  const updateNotifierRepository = new UpdateNotifierRepository(
    database,
    logger,
  )

  const updateNotifier = new UpdateNotifier(
    updateNotifierRepository,
    discordClient,
    logger,
  )

  const configReader = new ConfigReader()

  const updateMonitorRepository = new UpdateMonitorRepository(database, logger)

  const discoveryLogger = DiscoveryLogger.SERVER

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
  const discoveryRunner = new DiscoveryRunner(discoveryEngine, configReader)

  const updateMonitor = new UpdateMonitor(
    provider,
    discoveryRunner,
    updateNotifier,
    configReader,
    updateMonitorRepository,
    clock,
    logger,
    !!config.updateMonitor.runOnStart,
    DISCOVERY_LOGIC_VERSION,
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
