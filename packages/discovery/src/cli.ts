import { assert, Logger } from '@l2beat/backend-tools'
import { providers } from 'ethers'

import { handleCli } from './cli/handleCli'
import {
  DiscoveryCliConfig,
  getDiscoveryCliConfig,
} from './config/config.discovery'
import { ConfigReader } from './discovery/config/ConfigReader'
import { dryRunDiscovery, runDiscovery } from './discovery/runDiscovery'
import { runInversion } from './inversion/runInversion'
import { singleDiscovery } from './singleDiscovery'
import { ChainId } from './utils/ChainId'
import { EtherscanLikeClient } from './utils/EtherscanLikeClient'
import { HttpClient } from './utils/HttpClient'

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

async function main(): Promise<void> {
  const cli = handleCli()
  const config = getDiscoveryCliConfig(cli)
  const logger = Logger.DEBUG

  await discover(config, logger)
  await invert(config, logger)
  await singleDiscovery(config, logger)
}

async function discover(
  config: DiscoveryCliConfig,
  logger: Logger,
): Promise<void> {
  if (!config.discovery) {
    return
  }
  const discoverConfig = config.discovery
  const chainConfig = config.chain

  assert(
    chainConfig.chainId === discoverConfig.chainId,
    'Chain config does not match discovery config! Update "discovery.config" file or config.json of your project',
  )

  const http = new HttpClient()
  const provider = new providers.StaticJsonRpcProvider(chainConfig.rpcUrl)
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
      etherscanClient,
      config.chain.multicall,
      configReader,
      discoverConfig,
    )
    return
  }

  logger = logger.for('Discovery')
  logger.info('Starting discovery...\n')
  logger.info(`Project: ${discoverConfig.project}`)
  logger.info(`Chain: ${ChainId.getName(discoverConfig.chainId)}\n`)
  await runDiscovery(
    provider,
    etherscanClient,
    config.chain.multicall,
    configReader,
    discoverConfig,
  )
}

async function invert(
  config: DiscoveryCliConfig,
  logger: Logger,
): Promise<void> {
  if (!config.invert) {
    return
  }

  const { project, useMermaidMarkup, chainId } = config.invert

  const configReader = new ConfigReader()

  logger = logger.for('Inversion')
  logger.info('Starting')

  await runInversion(project, configReader, useMermaidMarkup, chainId)
}
