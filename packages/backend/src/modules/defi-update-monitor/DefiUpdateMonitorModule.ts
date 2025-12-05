import { Logger } from '@l2beat/backend-tools'
import { ProjectService } from '@l2beat/config'
import { HttpClient } from '@l2beat/shared'
import { DiscordClient } from '../../peripherals/discord/DiscordClient'
import type { ApplicationModule, ModuleDependencies } from '../types'
import { createDiscoveryRunner } from '../update-monitor/createDiscoveryRunner'
import { DiscoveryOutputCache } from '../update-monitor/DiscoveryOutputCache'
import { UpdateDiffer } from '../update-monitor/UpdateDiffer'
import { UpdateMessagesService } from '../update-monitor/UpdateMessagesService'
import { UpdateNotifier } from '../update-monitor/UpdateNotifier'
import { DefiUpdateMonitor } from './DefiUpdateMonitor'

export function createDefiUpdateMonitorModule({
  config,
  logger,
  peripherals,
  clock,
}: ModuleDependencies): ApplicationModule | undefined {
  if (!config.defiUpdateMonitor) {
    logger.info('DefiUpdateMonitor module disabled')
    return
  }

  logger = logger.tag({
    feature: 'defi_update_monitor',
    module: 'defi_update_monitor',
  })

  const paths = config.defiUpdateMonitor.paths
  const configReader = config.defiUpdateMonitor.configReader

  const discordClient = config.defiUpdateMonitor.discord
    ? peripherals.getClient(DiscordClient, config.defiUpdateMonitor.discord)
    : undefined

  const updateMessagesService = new UpdateMessagesService(
    peripherals.database,
    config.defiUpdateMonitor.updateMessagesRetentionPeriodDays,
  )

  const discoveryOutputCache = new DiscoveryOutputCache()
  const projectService = new ProjectService()

  const updateNotifier = new UpdateNotifier(
    peripherals.database,
    discordClient,
    logger,
    updateMessagesService,
    projectService,
    config.defiUpdateMonitor.disabledChains,
  )
  const updateDiffer = config.defiUpdateMonitor.updateDifferEnabled
    ? new UpdateDiffer(
        configReader,
        peripherals.database,
        discoveryOutputCache,
        logger,
      )
    : undefined

  // TODO: get rid of that once we achieve full library separation
  const http = new HttpClient()

  const { chains, cacheEnabled, cacheUri } = config.defiUpdateMonitor
  const runner = createDiscoveryRunner(
    paths,
    http,
    peripherals,
    logger,
    chains,
    !!cacheEnabled,
    cacheUri,
  )

  const defiUpdateMonitor = new DefiUpdateMonitor(
    runner,
    updateNotifier,
    updateDiffer,
    configReader,
    peripherals.database,
    clock,
    discoveryOutputCache,
    logger,
    !!config.defiUpdateMonitor.runOnStart,
  )

  const start = async () => {
    logger = logger.for('DefiUpdateMonitorModule')
    logger.info('Starting DeFi-specific update monitoring')

    await defiUpdateMonitor.start()
  }

  return {
    start,
  }
}
