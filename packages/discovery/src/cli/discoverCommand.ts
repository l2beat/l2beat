import { Logger } from '@l2beat/backend-tools'
import { HttpClient } from '@l2beat/shared'
import chalk from 'chalk'
import {
  boolean,
  command,
  flag,
  number,
  option,
  optional,
  positional,
  string,
} from 'cmd-ts'
import { getChainConfig, getChainConfigs } from '../config/config.discovery'
import type {
  DiscoveryChainConfig,
  DiscoveryModuleConfig,
} from '../config/types'
import { ConfigReader } from '../discovery/config/ConfigReader'
import { getDiscoveryPaths } from '../discovery/config/getDiscoveryPaths'
import { dryRunDiscovery, runDiscovery } from '../discovery/runDiscovery'
import { ChainValue } from './types'

export const DiscoverCommandArgs = {
  chain: positional({
    type: ChainValue,
    displayName: 'chain',
    description: 'name of the chain on which discovery will happen',
  }),
  project: positional({
    type: string,
    displayName: 'project',
    description: 'name of the project which will be discovered',
  }),
  dryRun: flag({
    type: boolean,
    long: 'dry-run',
    short: 'n',
    description: 'runs two discoveries and shows the diff',
  }),
  dev: flag({
    type: boolean,
    long: 'dev',
    description: 'runs discovery on the block saved in discovered.json',
  }),
  printStats: flag({
    type: boolean,
    long: 'stats',
    short: 'c',
    description: 'show the count of calls to external RPCs',
  }),
  verboseTemplatization: flag({
    type: boolean,
    long: 'templatization',
    short: 't',
    description: 'show templatization status of every contract',
  }),
  saveSources: flag({
    type: boolean,
    long: 'save-sources',
    short: 's',
    description: 'save raw sources downloaded from chain explorer',
  }),
  buildModels: flag({
    type: boolean,
    long: 'build-models',
    description: 'build models for every contract',
  }),
  buildProjectPageFacts: flag({
    type: boolean,
    long: 'build-project-page-facts',
    description: 'build project page facts',
  }),
  sourcesFolder: option({
    type: optional(string),
    long: 'sources-folder',
    description:
      'directory name to use instead of the default .code, does not change the output path',
  }),
  flatSourcesFolder: option({
    type: optional(string),
    long: 'flat-sources-folder',
    description:
      'directory name to use instead of the default .flat, does not change the output path',
  }),
  discoveryFilename: option({
    type: optional(string),
    long: 'discovery-filename',
    short: 'o',
    description:
      'file name to use instead of the discovered.json, does not change the output path',
  }),
  blockNumber: option({
    type: optional(number),
    long: 'block-number',
    short: 'b',
    description: 'the block number on which the discovery will be performed',
  }),
  overwriteCache: flag({
    type: boolean,
    long: 'overwrite-cache',
    description: 'overwrite the cache entries',
  }),
}

export const DiscoverCommand = command({
  name: 'discover',
  args: DiscoverCommandArgs,
  handler: (args) => {
    const chainConfigs = getChainConfigs()
    const chain = getChainConfig(args.chain)

    const config: DiscoveryModuleConfig = {
      ...args,
      chain,
    }

    discover(config, chainConfigs)
  },
})

export async function discover(
  config: DiscoveryModuleConfig,
  chainConfigs: DiscoveryChainConfig[] = getChainConfigs(),
  logger: Logger = Logger.DEBUG,
): Promise<void> {
  const http = new HttpClient()
  const paths = getDiscoveryPaths()
  const configReader = new ConfigReader(paths.discovery)

  if (config.dryRun) {
    logger = logger.for('DryRun')
    logger.info('Starting')

    await dryRunDiscovery(paths, http, configReader, config, chainConfigs)
    return
  }

  logger = logger.for('Discovery')
  logger.info(
    `Starting discovery of ${chalk.blue(config.project)} on ${chalk.blue(
      config.chain.name,
    )}`,
  )
  await runDiscovery(paths, http, configReader, config, chainConfigs)
}
