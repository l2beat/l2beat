import { Logger } from '@l2beat/backend-tools'
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
import { DiscoveryChainConfig, DiscoveryModuleConfig } from '../config/types'
import { ConfigReader } from '../discovery/config/ConfigReader'
import { dryRunDiscovery, runDiscovery } from '../discovery/runDiscovery'
import { HttpClient } from '../utils/HttpClient'
import { ChainValue } from './types'
import { ZeroToOneValue } from './types'

export const DiscoverCommand = command({
  name: 'discover',
  args: {
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
    saveSources: flag({
      type: boolean,
      long: 'save-sources',
      short: 's',
      description: 'save raw sources downloaded from chain explorer',
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
    printTemplateSimilarity: flag({
      type: boolean,
      long: 'print-template-similarity',
      short: 't',
      description:
        'at the end of discovery run print statistics about template similarity matching',
    }),
    templateSimilarityCutoff: option({
      type: ZeroToOneValue,
      long: 'template-similarity-cutoff',
      description: 'the minimal similarity of template matching to print out',
      defaultValue: () => 0.5,
      defaultValueIsSerializable: true,
    }),
  },
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
  const configReader = new ConfigReader()

  if (config.dryRun) {
    logger = logger.for('DryRun')
    logger.info('Starting')

    await dryRunDiscovery(http, configReader, config, chainConfigs)
    return
  }

  logger = logger.for('Discovery')
  logger.info(
    `Starting discovery of ${chalk.blue(config.project)} on ${chalk.blue(
      config.chain.name,
    )}`,
  )
  await runDiscovery(http, configReader, config, chainConfigs)
}
