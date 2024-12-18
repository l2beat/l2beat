import { execSync } from 'child_process'
import path from 'path'
import { Logger } from '@l2beat/backend-tools'
import { rimraf } from 'rimraf'

import { DiscoveryLogger } from '../discovery/DiscoveryLogger'
import { ConfigReader } from '../discovery/config/ConfigReader'
import { DiscoveryConfig } from '../discovery/config/DiscoveryConfig'
import { saveDiscoveryResult } from '../discovery/output/saveDiscoveryResult'
import { discover } from '../discovery/runDiscovery'

import { HttpClient } from '@l2beat/shared'
import { command, positional } from 'cmd-ts'
import { getChainConfigs } from '../config/config.discovery'
import { ChainValue, EthereumAddressValue } from './types'

export const SingleDiscoveryCommand = command({
  name: 'single-discovery',
  args: {
    address: positional({ type: EthereumAddressValue, displayName: 'address' }),
    chain: positional({ type: ChainValue, displayName: 'chain' }),
  },
  handler: async ({ address, chain }) => {
    const logger = Logger.DEBUG.for('SingleDiscovery')
    logger.info('Starting')

    const chainConfigs = getChainConfigs()
    const configReader = new ConfigReader()
    const projectConfig = new DiscoveryConfig(
      {
        name: address.toString(),
        chain: chain,
        initialAddresses: [address],
      },
      {},
      {},
      configReader,
    )
    const http = new HttpClient()

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
  },
})
