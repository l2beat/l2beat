import { execSync } from 'child_process'
import path from 'path'
import { Logger } from '@l2beat/backend-tools'
import { rimraf } from 'rimraf'

import { DiscoveryChainConfig, DiscoveryCliConfig } from '../config/types'
import { DiscoveryLogger } from '../discovery/DiscoveryLogger'
import { ConfigReader } from '../discovery/config/ConfigReader'
import { DiscoveryConfig } from '../discovery/config/DiscoveryConfig'
import { saveDiscoveryResult } from '../discovery/output/saveDiscoveryResult'
import { discover } from '../discovery/runDiscovery'
import { HttpClient } from '../utils/HttpClient'

export async function singleDiscoveryCommand(
  { singleDiscovery }: DiscoveryCliConfig,
  chainConfigs: DiscoveryChainConfig[],
  logger: Logger,
): Promise<void> {
  if (!singleDiscovery) {
    return
  }

  const configReader = new ConfigReader()
  const projectConfig = new DiscoveryConfig(
    {
      name: singleDiscovery.address.toString(),
      chain: singleDiscovery.chain.name,
      initialAddresses: [singleDiscovery.address],
    },
    configReader,
  )
  const http = new HttpClient()

  logger = logger.for('SingleDiscovery')
  logger.info('Starting')

  const { result, blockNumber } = await discover(
    chainConfigs,
    projectConfig,
    DiscoveryLogger.CLI,
    undefined,
    http,
  )

  const rootFolder = `./cache/single-discovery`
  await rimraf(rootFolder)

  await saveDiscoveryResult(
    result,
    projectConfig,
    blockNumber,
    DiscoveryLogger.CLI,
    { rootFolder },
  )

  logger.info(
    'Opening discovered.json in the browser, please use firefox or other browser with JSON viewer extension',
  )
  logger.info(
    'The discovered.json & code can be found in "./cache/single-discovery"',
  )

  const jsonFilePath = path.join(rootFolder, 'discovered.json')
  execSync(`open ${jsonFilePath}`)
}
