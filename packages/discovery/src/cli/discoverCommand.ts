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
import { getChainConfigs } from '../config/config.discovery'
import type {
  DiscoveryChainConfig,
  DiscoveryModuleConfig,
} from '../config/types'
import { ConfigReader } from '../discovery/config/ConfigReader'
import { getDiscoveryPaths } from '../discovery/config/getDiscoveryPaths'
import { dryRunDiscovery, runDiscovery } from '../discovery/runDiscovery'
import { configureLogger } from './logger'
import { PositiveInteger } from './types'

export const DiscoverCommandArgs = {
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
  timestamp: option({
    type: optional(number),
    long: 'timestamp',
    short: 'd',
    description: 'the timestamp on which the discovery will be performed',
  }),
  overwriteCache: flag({
    type: boolean,
    long: 'overwrite-cache',
    description: 'overwrite the cache entries',
  }),
  ai: flag({
    type: boolean,
    long: 'ai',
    description:
      'author a template with a model for every verified contract no template matches; when a contract whose code changed still fits its old template, add to that template instead (writes into _templates; review before committing)',
  }),
  aiModel: option({
    type: optional(string),
    long: 'ai-model',
    description:
      'model for --ai: a Codex model name (default: Codex default), or an opencode gateway model, opencode/<model> (Zen) or opencode-go/<model> (Go), e.g. opencode-go/deepseek-v4.1-flash for the cheap option',
  }),
  aiRounds: option({
    type: optional(PositiveInteger),
    long: 'ai-rounds',
    description:
      'model turns per contract for --ai, the first included (default 3)',
  }),
  aiEffort: option({
    type: optional(string),
    long: 'ai-effort',
    description:
      'reasoning effort for --ai (default high): for opencode one of the levels of the model, which `opencode models <provider> --verbose` lists under variants (DeepSeek: low, high, max); for Codex none, minimal, low, medium, high, xhigh or max',
  }),
  aiRevisit: flag({
    type: boolean,
    long: 'ai-revisit',
    description:
      '--ai, and also ask the model for additions to every template that already matches (keeps all existing fields; review shared-template changes before committing)',
  }),
}

export const DiscoverCommand = command({
  name: 'discover',
  args: DiscoverCommandArgs,
  handler: async (args) => {
    const chainConfigs = getChainConfigs()

    const config: DiscoveryModuleConfig = { ...args }

    await discover(config, chainConfigs)
  },
})

export async function discover(
  config: DiscoveryModuleConfig,
  chainConfigs: DiscoveryChainConfig[] = getChainConfigs(),
  logger: Logger = configureLogger(Logger.DEBUG),
): Promise<void> {
  const http = new HttpClient()
  const paths = getDiscoveryPaths()
  const configReader = new ConfigReader(paths.discovery)

  if (config.dryRun) {
    logger = logger.for('DryRun')
    logger.info('Starting')

    await dryRunDiscovery(
      paths,
      http,
      configReader,
      config,
      chainConfigs,
      logger,
    )
    return
  }

  logger = logger.for('Discovery')
  logger.info(`Starting discovery of ${chalk.blue(config.project)}`)
  await runDiscovery(paths, http, configReader, config, chainConfigs, logger)
}
