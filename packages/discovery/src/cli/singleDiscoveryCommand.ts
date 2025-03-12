import { execSync } from 'child_process'
import path from 'path'
import { Logger } from '@l2beat/backend-tools'
import { HttpClient } from '@l2beat/shared'
import { boolean, command, flag, positional } from 'cmd-ts'
import { rimraf } from 'rimraf'
import { getChainConfigs } from '../config/config.discovery'
import { DiscoveryLogger } from '../discovery/DiscoveryLogger'
import { TEMPLATES_PATH } from '../discovery/analysis/TemplateService'
import { ConfigReader } from '../discovery/config/ConfigReader'
import { DiscoveryConfig } from '../discovery/config/DiscoveryConfig'
import { getDiscoveryPaths } from '../discovery/config/getDiscoveryPaths'
import { saveDiscoveryResult } from '../discovery/output/saveDiscoveryResult'
import { discover } from '../discovery/runDiscovery'
import { ChainValue, EthereumAddressValue } from './types'

export const SingleDiscoveryCommand = command({
  name: 'single-discovery',
  args: {
    address: positional({ type: EthereumAddressValue, displayName: 'address' }),
    chain: positional({ type: ChainValue, displayName: 'chain' }),
    overwriteCache: flag({
      type: boolean,
      long: 'overwrite-cache',
      description: 'overwrite the cache entries',
    }),
  },
  handler: async ({ address, chain, overwriteCache }) => {
    const logger = Logger.DEBUG.for('SingleDiscovery')
    logger.info('Starting')

    const chainConfigs = getChainConfigs()
    const paths = getDiscoveryPaths()

    const configReader = new ConfigReader(paths.discovery)
    const projectConfig = new DiscoveryConfig(
      {
        name: address.toString(),
        chain: chain,
        initialAddresses: [address],
      },
      configReader,
    )
    const http = new HttpClient()

    const { result, blockNumber } = await discover(
      paths,
      chainConfigs,
      projectConfig,
      DiscoveryLogger.CLI,
      undefined,
      http,
      overwriteCache,
    )

    const rootFolder = `./cache/single-discovery`
    const templatesFolder = path.join(paths.discovery, TEMPLATES_PATH)

    await rimraf(rootFolder)

    await saveDiscoveryResult(
      result,
      projectConfig,
      blockNumber,
      DiscoveryLogger.CLI,
      {
        paths: { ...paths, discovery: rootFolder },
        templatesFolder,
      },
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
