import { Logger } from '@l2beat/backend-tools'
import { providers } from 'ethers'

import { getDiscoveryCliConfig } from '../config/config.discovery'
import { DiscoveryCliConfig, DiscoveryModuleConfig } from '../config/types'
import { ConfigReader } from '../discovery/config/ConfigReader'
import { dryRunDiscovery, runDiscovery } from '../discovery/runDiscovery'
import { EtherscanLikeClient } from '../utils/EtherscanLikeClient'
import { HttpClient } from '../utils/HttpClient'

export async function discoverCommand(
  config: DiscoveryCliConfig,
  logger: Logger,
): Promise<void> {
  if (!config.discovery) {
    return
  }
  const discoverConfig = config.discovery
  const chainConfig = discoverConfig.chain

  const http = new HttpClient()
  const provider = new providers.StaticJsonRpcProvider(chainConfig.rpcUrl)
  const eventProvider =
    chainConfig.eventRpcUrl === undefined
      ? provider
      : new providers.StaticJsonRpcProvider(chainConfig.eventRpcUrl)
  const etherscanClient = EtherscanLikeClient.createForDiscovery(
    http,
    chainConfig.etherscanUrl,
    chainConfig.etherscanApiKey,
    chainConfig.etherscanUnsupported,
  )
  const configReader = new ConfigReader()

  if (discoverConfig.dryRun) {
    logger = logger.for('DryRun')
    logger.info('Starting')

    await dryRunDiscovery(
      provider,
      eventProvider,
      etherscanClient,
      chainConfig.multicall,
      configReader,
      discoverConfig,
    )
    return
  }

  logger = logger.for('Discovery')
  logger.info('Starting discovery...')
  logger.info(`Project: ${discoverConfig.project}`)
  logger.info(`Chain: ${discoverConfig.chain.name}\n`)
  await runDiscovery(
    provider,
    eventProvider,
    etherscanClient,
    chainConfig.multicall,
    configReader,
    discoverConfig,
  )
}

/**
 * Expose the discover command as a method exported by the package.
 */
export function discover(
  config: DiscoveryModuleConfig,
  logger: Logger = Logger.DEBUG,
): Promise<void> {
  const cliConfig = getDiscoveryCliConfig({
    mode: 'discover',
    project: config.project,
    chain: config.chain.name,
    dryRun: config.dryRun === true,
    dev: config.dev === true,
    sourcesFolder: config.sourcesFolder,
    flatSourcesFolder: config.flatSourcesFolder,
    discoveryFilename: config.discoveryFilename,
    blockNumber: config.blockNumber,
  })

  return discoverCommand(cliConfig, logger)
}
