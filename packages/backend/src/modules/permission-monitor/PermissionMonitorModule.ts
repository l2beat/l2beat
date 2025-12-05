import { DiscordClient } from '../../peripherals/discord/DiscordClient'
import type { ApplicationModule, ModuleDependencies } from '../types'
import { PermissionMonitor } from './PermissionMonitor'
import { PermissionNotifier } from './PermissionNotifier'

export function createPermissionMonitorModule({
  config,
  logger,
  peripherals,
  clock,
}: ModuleDependencies): ApplicationModule | undefined {
  if (!config.permissionMonitor) {
    logger.info('PermissionMonitor module disabled')
    return
  }

  logger = logger.tag({
    feature: 'permission_monitor',
    module: 'permission_monitor',
  })

  const configReader = config.permissionMonitor.configReader
  const configBasePath = config.permissionMonitor.configBasePath

  const discordClient = config.permissionMonitor.discord
    ? peripherals.getClient(DiscordClient, config.permissionMonitor.discord)
    : undefined

  const permissionNotifier = new PermissionNotifier(
    peripherals.database,
    discordClient,
    logger,
  )

  const permissionMonitor = new PermissionMonitor(
    configReader,
    peripherals.database,
    permissionNotifier,
    clock,
    logger,
    !!config.permissionMonitor.runOnStart,
    configBasePath,
  )

  return {
    start: async () => {
      logger = logger.for('PermissionMonitorModule')
      logger.info('Starting')
      await permissionMonitor.start()
    },
  }
}
