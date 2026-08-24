import type { Logger } from '@l2beat/backend-tools'
import {
  ConfigReader,
  findClusterConsumers,
  getDiscoveryPaths,
  modelPermissionsCommand,
  TemplateService,
} from '@l2beat/discovery'
import chalk from 'chalk'
import {
  boolean,
  command,
  flag,
  oneOf,
  option,
  optional,
  positional,
  string,
} from 'cmd-ts'
import { keyInYN } from 'readline-sync'
import { getPlainLogger } from '../implementations/common/getPlainLogger'
import { discoverAndUpdateDiffHistory } from '../implementations/discovery/discoveryWrapper'
import { updateDiffHistory } from '../implementations/discovery/updateDiffHistory'

const DISCOVER_SCOPES = ['project', 'all', 'none'] as const
type DiscoverScope = (typeof DISCOVER_SCOPES)[number]

export const RefreshCluster = command({
  name: 'refresh-cluster',
  description:
    'Refresh a shared module together with every project that references it.',
  args: {
    project: positional({
      type: string,
      displayName: 'project',
      description: 'Shared module to refresh',
    }),
    discover: option({
      type: oneOf(DISCOVER_SCOPES),
      long: 'discover',
      defaultValue: (): DiscoverScope => 'project',
      description: [
        'What to rediscover on chain:',
        '"project" (default) only the shared module,',
        '"all" its consumers as well,',
        '"none" nothing, just remodel permissions.',
      ].join(' '),
    }),
    message: option({
      type: optional(string),
      long: 'message',
      short: 'm',
      description:
        'Message that will be written in the description section of diffHistory.md',
    }),
    confirmed: flag({
      type: boolean,
      long: 'yes',
      short: 'y',
      description: 'accept the refresh, do not prompt the user.',
    }),
    debug: flag({
      type: boolean,
      long: 'debug',
      short: 'd',
      description: 'Keep debug Clingo files',
    }),
  },
  handler: async (args) => {
    const paths = getDiscoveryPaths()
    const configReader = new ConfigReader(paths.discovery)
    const templateService = new TemplateService(paths.discovery)
    const logger = getPlainLogger()

    const consumers = findClusterConsumers(configReader, args.project)
    logger.info(`Cluster of ${chalk.green(args.project)}:`)
    for (const consumer of consumers) {
      logger.info(`  - ${consumer}`)
    }
    logger.info(
      `\n${describePlan(args.project, consumers.length, args.discover)}`,
    )
    if (!args.confirmed && !keyInYN('Do you want to continue?')) {
      return
    }

    const failures: { project: string; message: string }[] = []
    const options = {
      configReader,
      templateService,
      paths,
      logger,
      description: args.message,
    }

    const discoverProject = async (project: string) =>
      discoverAndUpdateDiffHistory(
        { project, dev: true, overwriteCache: false },
        options,
      )
    // Remodelling reads every referenced project from disk, so nothing here
    // touches the chain.
    const remodelProject = async (project: string) => {
      await modelPermissionsCommand(
        project,
        configReader,
        templateService,
        paths,
        args.debug,
        logger,
      )
      await updateDiffHistory(project, args.message)
    }

    await runSafely(args.project, failures, logger, () =>
      args.discover === 'none'
        ? remodelProject(args.project)
        : discoverProject(args.project),
    )

    for (const consumer of consumers) {
      await runSafely(consumer, failures, logger, () =>
        args.discover === 'all'
          ? discoverProject(consumer)
          : remodelProject(consumer),
      )
    }

    if (failures.length > 0) {
      logger.error(`Refresh failed for ${failures.length} project(s):`)
      for (const { project, message } of failures) {
        logger.error(`- ${project}: ${message}`)
      }
    }
  },
})

function describePlan(
  project: string,
  consumerCount: number,
  discover: DiscoverScope,
): string {
  const forProject =
    discover === 'none'
      ? `${project} will be remodelled`
      : `${project} will be rediscovered`
  const forConsumers = discover === 'all' ? 'rediscovered' : 'remodelled'
  return `${forProject}, ${consumerCount} consumer(s) will be ${forConsumers}.`
}

async function runSafely(
  project: string,
  failures: { project: string; message: string }[],
  logger: Logger,
  task: () => Promise<void>,
): Promise<void> {
  try {
    await task()
  } catch (error) {
    const message = (
      error instanceof Error ? error.message : String(error)
    ).split('\n')[0]
    logger.error(`${chalk.red('FAILED')} ${project}: ${message}`)
    failures.push({ project, message })
  }
}
