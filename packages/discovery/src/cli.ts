import { ArbiscanClient, HttpClient, Logger } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { providers } from 'ethers'

import { handleCli } from './cli/handleCli'
import {
  DiscoveryCliConfig,
  getDiscoveryCliConfig,
} from './config/config.discovery'
import { ConfigReader } from './discovery/config/ConfigReader'
import { runDiscovery } from './discovery/runDiscovery'
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

  const http = new HttpClient()
  // const provider = new providers.AlchemyProvider(
  //   'mainnet',
  //   config.discovery.alchemyApiKey,
  // )
  // const etherscanClient = new EtherscanClient(
  //   http,
  //   config.discovery.etherscanApiKey,
  //   new UnixTime(0),
  // )

  const providerArb = new providers.AlchemyProvider(
    'arbitrum',
    config.discovery.arbitrumRpcApiKey,
  )
  const etherscanClientArb = new ArbiscanClient(
    http,
    config.discovery.arbiscanApiKey,
    UnixTime.fromDate(new Date('2021-05-28T22:15:00Z')),
  )
  const configReader = new ConfigReader()

  // if (config.discovery.dryRun) {
  //   logger = logger.for('DryRun')
  //   logger.info('Starting')

  //   await dryRunDiscovery(
  //     providerArb,
  //     etherscanClientArb,
  //     configReader,
  //     config.discovery,
  //   )
  //   return
  // }

  logger = logger.for('Discovery')
  logger.info('Starting')
  logger.info('Starting for Arbitrum')
  await runDiscovery(
    providerArb,
    etherscanClientArb,
    configReader,
    config.discovery,
  )
}

async function invert(config: DiscoveryCliConfig, logger: Logger) {
  if (!config.invert) {
    return
  }

  const { file, useMermaidMarkup } = config.invert

  const configReader = new ConfigReader()

  logger = logger.for('Inversion')
  logger.info('Starting')

  await runInversion(file, configReader, useMermaidMarkup)
}
