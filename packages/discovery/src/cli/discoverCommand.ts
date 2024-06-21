import { Logger } from '@l2beat/backend-tools'

import { getDiscoveryCliConfig } from '../config/config.discovery'
import {
  DiscoveryChainConfig,
  DiscoveryCliConfig,
  DiscoveryModuleConfig,
} from '../config/types'
import { ConfigReader } from '../discovery/config/ConfigReader'
import { dryRunDiscovery, runDiscovery } from '../discovery/runDiscovery'
import { HttpClient } from '../utils/HttpClient'

export async function discoverCommand(
  config: DiscoveryCliConfig,
  chainConfigs: DiscoveryChainConfig[],
  logger: Logger,
): Promise<void> {
  if (!config.discovery) {
    return
  }
  const discoverConfig = config.discovery
  const http = new HttpClient()
  const configReader = new ConfigReader()

  if (discoverConfig.dryRun) {
    logger = logger.for('DryRun')
    logger.info('Starting')

    await dryRunDiscovery(http, configReader, discoverConfig, chainConfigs)
    return
  }

  logger = logger.for('Discovery')
  logger.info('Starting discovery...')
  logger.info(`Project: ${discoverConfig.project}`)
  logger.info(`Chain: ${discoverConfig.chain.name}\n`)
  await runDiscovery(http, configReader, discoverConfig, chainConfigs)
}

/**
 * Expose the discover command as a method exported by the package.
 */
export function discover(
  config: DiscoveryModuleConfig,
  logger: Logger = Logger.DEBUG,
  chainConfigs = [config.chain],
): Promise<void> {
  const cliConfig = getDiscoveryCliConfig({
    mode: 'discover',
    project: config.project,
    chain: config.chain.name,
    dryRun: config.dryRun === true,
    dev: config.dev === true,
    printStats: config.printStats === true,
    sourcesFolder: config.sourcesFolder,
    flatSourcesFolder: config.flatSourcesFolder,
    discoveryFilename: config.discoveryFilename,
    blockNumber: config.blockNumber,
  })

  return discoverCommand(cliConfig, chainConfigs, logger)
}
