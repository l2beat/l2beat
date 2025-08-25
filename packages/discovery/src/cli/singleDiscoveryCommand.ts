import { Logger } from '@l2beat/backend-tools'
import { HttpClient } from '@l2beat/shared'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { execSync } from 'child_process'
import { boolean, command, flag, positional } from 'cmd-ts'
import groupBy from 'lodash/groupBy'
import path from 'path'
import { rimraf } from 'rimraf'
import { getChainConfigs } from '../config/config.discovery'
import { TEMPLATES_PATH } from '../discovery/analysis/TemplateService'
import { ConfigRegistry } from '../discovery/config/ConfigRegistry'
import { getDiscoveryPaths } from '../discovery/config/getDiscoveryPaths'
import { saveDiscoveryResult } from '../discovery/output/saveDiscoveryResult'
import { discover } from '../discovery/runDiscovery'
import { configureLogger } from './logger'
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
    const logger = configureLogger(Logger.DEBUG.for('SingleDiscovery'))
    logger.info('Starting')

    const chainConfigs = getChainConfigs()
    const paths = getDiscoveryPaths()
    const projectConfig = new ConfigRegistry({
      name: address.toString(),
      chain: chain,
      initialAddresses: [address],
    })
    const http = new HttpClient()

    const { result, timestamp, usedBlockNumbers } = await discover(
      paths,
      chainConfigs,
      projectConfig,
      Logger.INFO,
      undefined,
      http,
      overwriteCache,
    )

    const rootFolder = './cache/single-discovery'
    const templatesFolder = path.join(paths.discovery, TEMPLATES_PATH)

    await rimraf(rootFolder)

    const grouped = groupBy(result, (entry) =>
      ChainSpecificAddress.longChain(entry.address),
    )

    for (const [chain, entries] of Object.entries(grouped)) {
      await saveDiscoveryResult(
        chain,
        entries,
        projectConfig,
        timestamp,
        { [chain]: usedBlockNumbers[chain] } as Record<string, number>,
        Logger.INFO,
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
    }
  },
})
