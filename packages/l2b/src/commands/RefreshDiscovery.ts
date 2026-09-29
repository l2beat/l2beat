import {
  ConfigReader,
  type ConfigRegistry,
  getDiscoveryPaths,
  TemplateService,
} from '@l2beat/discovery'
import { asciiProgressBar, formatSeconds } from '@l2beat/shared-pure'
import chalk from 'chalk'
import { boolean, command, flag, option, optional, string } from 'cmd-ts'
import { keyInYN } from 'readline-sync'
import {
  type CliLogger,
  createCliLogger,
} from '../implementations/common/CliLogger'
import { TimePredictor } from '../implementations/common/TimePredictor'
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
    message: option({
      type: optional(string),
      long: 'message',
      short: 'm',
      description:
        'Message that will be written in the description section of diffHistory.md.',
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
    const cli = createCliLogger({ output: process.stdout, quiet: false })
    const logger = cli.toLogger(args.concise ? 'WARN' : 'INFO')

    const projectChain = configReader
      .readAllDiscoveredProjects()
      .filter((project) =>
        args.excludeProjects ? !args.excludeProjects.includes(project) : true,
      )
      .flatMap((project) => configReader.readConfig(project))
      .filter((config) => config.archived !== true)

    const toRefresh: { config: ConfigRegistry; reason: string }[] = []
    let foundFrom = false

    if (args.excludeProjects?.length) {
      logger.info('Excluding projects:', args.excludeProjects?.join(', '))
    }

    for (const config of projectChain) {
      if (args.from !== undefined) {
        if (!foundFrom && `${config.name}` === args.from) {
          foundFrom = true
        }
        if (!foundFrom) {
          continue
        }
      }
      const discovery = configReader.readDiscovery(config.name)
      const [rawReason] = templateService.discoveryNeedsRefresh(
        discovery,
        config,
      )
      const needsRefreshReason = args.all
        ? '--all flag was provided'
        : rawReason
          ? templateService.formatReason(rawReason)
          : undefined
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
        logger.info(`- ${config.name} (${reason})`)
      }
      logger.info(
        `\nOverall ${toRefresh.length} projects need discovery refresh.`,
      )
      if (args.confirmed || keyInYN('Do you want to continue?')) {
        const failedProjects = await refreshProjects(
          toRefresh.map(({ config }) => config.name),
          cli,
          (project) =>
            discoverAndUpdateDiffHistory(
              { project, dev: true, overwriteCache: args.overwriteCache },
              {
                description: args.message,
                configReader,
                templateService,
                paths,
                logger,
              },
            ),
        )

        if (failedProjects.length > 0) {
          logger.error(
            `Discovery failed for ${failedProjects.length} project(s):`,
          )
          for (const { name, message } of failedProjects) {
            logger.error(`- ${name}: ${message}`)
          }
        }
      }
    }
  },
})

async function refreshProjects(
  projects: string[],
  cli: CliLogger,
  refresh: (project: string) => Promise<void>,
): Promise<{ name: string; message: string }[]> {
  const predictor = new TimePredictor()
  const failedProjects: { name: string; message: string }[] = []
  const progress = cli.status()
  let current = { index: 0, startedAt: performance.now() }
  const draw = () => {
    const elapsedSeconds = (performance.now() - current.startedAt) / 1000
    const remainingAfterCurrent = projects.length - current.index - 1
    const average = predictor.averageSeconds()
    const timeLeftSeconds =
      average === undefined
        ? undefined
        : Math.max(0, average - elapsedSeconds) +
          average * remainingAfterCurrent
    progress.update(
      formatReport(
        current.index,
        projects.length,
        timeLeftSeconds,
        projects[current.index],
      ),
    )
  }
  const ticker = setInterval(draw, 1000)
  try {
    for (const [i, project] of projects.entries()) {
      current = { index: i, startedAt: performance.now() }
      draw()
      try {
        await refresh(project)
      } catch (error) {
        failedProjects.push({ name: project, message: getErrorMessage(error) })
      }
      predictor.update((performance.now() - current.startedAt) / 1000)
    }
  } finally {
    clearInterval(ticker)
  }
  const refreshedCount = projects.length - failedProjects.length
  progress.done(
    failedProjects.length === 0
      ? `Refreshed ${refreshedCount} projects`
      : `Refreshed ${refreshedCount} projects, ${failedProjects.length} failed`,
  )
  return failedProjects
}

function formatReport(
  finishedCount: number,
  count: number,
  timeLeftSeconds: number | undefined,
  status: string,
): string {
  const bar = chalk.cyan(asciiProgressBar(finishedCount, count))
  const timeLeft =
    timeLeftSeconds === undefined ? '?' : formatSeconds(timeLeftSeconds)
  const eta = `ETA: ${timeLeft.padEnd(6)}`
  const countDigits = count.toString().length
  const counter = colorMap(
    `[${(finishedCount + 1).toFixed().padStart(countDigits)}/${count}]`,
    finishedCount,
    count,
  )
  return [bar, eta, `${counter} ${status}`].join(' | ')
}

function getErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error)
  return message.split('\n')[0]
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
