import { EtherscanLikeClient, HttpClient, Logger } from '@l2beat/shared'
import { assert, ChainId } from '@l2beat/shared-pure'
import { providers } from 'ethers'

import { handleCli } from './cli/handleCli'
import {
  DiscoveryCliConfig,
  getDiscoveryCliConfig,
} from './config/config.discovery'
import { ConfigReader } from './discovery/config/ConfigReader'
import { dryRunDiscovery, runDiscovery } from './discovery/runDiscovery'
import { runInversion } from './inversion/runInversion'

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

async function main() {
  const cli = handleCli()
  const config = getDiscoveryCliConfig(cli)
  const logger = Logger.DEBUG

  await discover(config, logger)
  await invert(config, logger)
}

async function discover(config: DiscoveryCliConfig, logger: Logger) {
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
  const etherscanClient = new EtherscanLikeClient(
    http,
    chainConfig.etherscanUrl,
    chainConfig.etherscanApiKey,
    chainConfig.minTimestamp,
  )
  const configReader = new ConfigReader()

  if (discoverConfig.dryRun) {
    logger = logger.for('DryRun')
    logger.info('Starting')

    await dryRunDiscovery(
      provider,
      etherscanClient,
      configReader,
      discoverConfig,
    )
    return
  }

  logger = logger.for('Discovery')
  logger.info('Starting discovery...\n')
  logger.info(`Project: ${discoverConfig.project}`)
  logger.info(`Chain: ${ChainId.getName(discoverConfig.chainId)}\n`)
  await runDiscovery(provider, etherscanClient, configReader, discoverConfig)
}

async function invert(config: DiscoveryCliConfig, logger: Logger) {
  if (!config.invert) {
    return
  }

  const { project, useMermaidMarkup, chainId } = config.invert

  const configReader = new ConfigReader()

  logger = logger.for('Inversion')
  logger.info('Starting')

  await runInversion(project, configReader, useMermaidMarkup, chainId)
}
