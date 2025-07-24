import type { Logger } from '@l2beat/backend-tools'
import {
  ConfigReader,
  type ConfigRegistry,
  getChainConfig,
  getDiscoveryPaths,
  TemplateService,
} from '@l2beat/discovery'
import { asciiProgressBar, formatSeconds } from '@l2beat/shared-pure'
import chalk from 'chalk'
import { boolean, command, flag, option, optional, string } from 'cmd-ts'
import { keyInYN } from 'readline-sync'
import { getPlainLogger } from '../implementations/common/getPlainLogger'
import { discoverAndUpdateDiffHistory } from '../implementations/discovery/discoveryWrapper'
import { Separated } from './types'

export const RefreshDiscovery = command({
  name: 'refresh-discovery',
  description: 'Rerun discovery on projects that need changes.',
  args: {
    all: flag({
      type: boolean,
      long: 'all',
      short: 'a',
      description: 'refreshes discovery for every project.',
    }),
    from: option({
      type: optional(string),
      long: 'from',
      short: 'f',
      description:
        'where to at which project start discovery, format <project>/<chain>.',
    }),
    confirmed: flag({
      type: boolean,
      long: 'yes',
      short: 'y',
      description: 'accept the refresh, do not prompt the user.',
    }),
    excludeProjects: option({
      type: optional(Separated(string)),
      long: 'exclude-projects',
      short: 'p',
      description: 'exclude projects from discovery, comma separated.',
    }),
    excludeChains: option({
      type: optional(Separated(string)),
      long: 'exclude-chains',
      short: 'c',
      description: 'exclude chains from discovery, comma separated.',
    }),
    message: option({
      type: optional(string),
      long: 'message',
      short: 'm',
      description:
        'Message that will be written in the description section of diffHistory.md.',
    }),
    group: option({
      type: optional(string),
      long: 'group',
      short: 'g',
      description: 'group of projects to refresh.',
    }),
    overwriteCache: flag({
      type: boolean,
      long: 'overwrite-cache',
      description: 'overwrite the cache entries.',
    }),
    concise: flag({
      type: boolean,
      long: 'concise',
      short: 'q',
      description: 'prints only the report summary, discovery is silent',
    }),
  },
  handler: async (args) => {
    const paths = getDiscoveryPaths()
    const configReader = new ConfigReader(paths.discovery)
    const templateService = new TemplateService(paths.discovery)
    const logger = getPlainLogger(args.concise ? 'WARN' : 'INFO')

    const projects = args.group
      ? configReader.getProjectsInGroup(args.group)
      : null

    const chainConfigs = configReader
      .readAllDiscoveredProjects()
      .filter((entry) => (projects ? projects.includes(entry.project) : true))
      .filter((entry) =>
        args.excludeProjects
          ? !args.excludeProjects.includes(entry.project)
          : true,
      )
      .flatMap(({ project, chains }) =>
        chains.map((chain) => configReader.readConfig(project, chain)),
      )
      .filter((config) =>
        args.excludeChains ? !args.excludeChains.includes(config.chain) : true,
      )
      .sort((a, b) => a.chain.localeCompare(b.chain))

    const toRefresh: { config: ConfigRegistry; reason: string }[] = []
    let foundFrom = false

    if (args.excludeChains?.length) {
      logger.info('Excluding chains:', args.excludeChains?.join(', '))
    }
    if (args.excludeProjects?.length) {
      logger.info('Excluding projects:', args.excludeProjects?.join(', '))
    }

    for (const config of chainConfigs) {
      if (args.from !== undefined) {
        if (!foundFrom && `${config.name}/${config.chain}` === args.from) {
          foundFrom = true
        }
        if (!foundFrom) {
          continue
        }
      }
      const discovery = configReader.readDiscovery(config.name, config.chain)
      const needsRefreshReason = args.all
        ? '--all flag was provided'
        : templateService.discoveryNeedsRefresh(discovery, config)
      if (needsRefreshReason !== undefined) {
        toRefresh.push({ config, reason: needsRefreshReason })
      }
    }

    if (toRefresh.length === 0) {
      logger.info(
        'All projects are up to date. Pass --all flag to refresh anyway.',
      )
    } else {
      logger.info('Found projects that need discovery refresh:')
      for (const { config, reason } of toRefresh) {
        logger.info(`- ${config.chain}/${config.name} (${reason})`)
      }
      logger.info(
        `\nOverall ${toRefresh.length} projects need discovery refresh.`,
      )
      if (args.confirmed || keyInYN('Do you want to continue?')) {
        const startTime = performance.now()
        for (const [i, { config }] of toRefresh.entries()) {
          await discoverAndUpdateDiffHistory(
            {
              project: config.name,
              chain: getChainConfig(config.chain),
              dev: true,
              overwriteCache: args.overwriteCache,
            },
            {
              description: args.message,
              configReader,
              templateService,
              paths,
              logger,
            },
          )

          reportStatus(
            logger,
            i + 1,
            toRefresh.length,
            performance.now() - startTime,
            `${config.name}/${config.chain}`,
          )
        }
      }
    }
  },
})

function reportStatus(
  logger: Logger,
  finishedCount: number,
  count: number,
  runTime: number,
  project: string,
) {
  const bar = chalk.cyan(asciiProgressBar(finishedCount, count))
  const timeLeft = formatSeconds(
    ((runTime / finishedCount) * (count - finishedCount)) / 1000,
  )
  const eta = `ETA: ${timeLeft.padEnd(6)}`
  const countDigits = count.toString().length
  const counter = colorMap(
    `[${finishedCount.toFixed().padStart(countDigits)}/${count}]`,
    finishedCount,
    count,
  )
  const status = `${counter} ${project}`

  const report = [bar, eta, status]
  logger.warn(report.join(' | '))
}

function colorMap(toColor: string, value: number, multiplier = 1): string {
  if (value < 0.125 * multiplier) {
    return chalk.grey(toColor)
  }
  if (value < 0.25 * multiplier) {
    return chalk.red(toColor)
  }
  if (value < 0.375 * multiplier) {
    return chalk.redBright(toColor)
  }
  if (value < 0.5 * multiplier) {
    return chalk.magenta(toColor)
  }
  if (value < 0.625 * multiplier) {
    return chalk.magentaBright(toColor)
  }
  if (value < 0.75 * multiplier) {
    return chalk.yellow(toColor)
  }
  if (value < 0.875 * multiplier) {
    return chalk.yellowBright(toColor)
  }
  return chalk.greenBright(toColor)
}
