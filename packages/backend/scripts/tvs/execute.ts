import * as fs from 'fs'
import {
  type Env,
  LogFormatterPretty,
  type LogLevel,
  Logger,
  getEnv,
} from '@l2beat/backend-tools'
import { ProjectService } from '@l2beat/config'
import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import {
  boolean,
  command,
  flag,
  optional,
  positional,
  run,
  string,
} from 'cmd-ts'
import { LocalExecutor } from '../../src/modules/tvs/tools/LocalExecutor'
import type {
  ProjectTvsConfig,
  Token,
  TokenValue,
  TvsBreakdown,
} from '../../src/modules/tvs/types'

const args = {
  project: positional({
    type: optional(string),
    displayName: 'projectId',
    description: 'Project for which tvs will be executed',
  }),
  includeBridges: flag({
    type: boolean,
    long: 'include-bridges',
    short: 'ib',
    description: 'Include bridges in the TVS calculation',
  }),
}

const cmd = command({
  name: 'execute',
  args,
  handler: async (args) => {
    const env = getEnv()
    const logger = initLogger(env)
    const ps = new ProjectService()
    const localExecutor = new LocalExecutor(ps, env, logger)

    const timestamp =
      UnixTime.toStartOf(UnixTime.now(), 'hour') - 3 * UnixTime.HOUR

    if (!args.project) {
      const projects = await ps.getProjects({
        select: ['tvlConfig'],
        optional: ['chainConfig'],
        ...(args.includeBridges ? {} : { whereNot: ['isBridge'] }),
      })

      if (!projects) {
        logger.error('No TVS projects found')
        process.exit(1)
      }

      logger.info(`Found ${projects.length} TVS projects`)

      let totalTvs = 0
      for (const project of projects) {
        logger.info(`Executing TVS config for project ${project.id}`)

        const config = readConfig(project.id, logger)

        if (config.tokens.length === 0) {
          continue
        }

        const tvs = await localExecutor.run(config, [timestamp], false)

        const valueForProject = tvs.reduce((acc, token) => {
          return acc + token.valueForProject
        }, 0)

        const valueForTotal = tvs.reduce((acc, token) => {
          return acc + token.valueForSummary
        }, 0)

        totalTvs += valueForTotal

        logger.info(`TVS for project ${toDollarString(valueForProject)}`)
        logger.info(`Total TVS ${toDollarString(totalTvs)}`)
      }
    } else {
      const project = await ps.getProject({
        id: ProjectId(args.project),
        select: ['tvlConfig'],
        optional: ['chainConfig'],
      })

      if (!project) {
        logger.error(`Project '${args.project}' not found`)
        process.exit(1)
      }

      const config = readConfig(args.project, logger)

      const tvs = await localExecutor.run(config, [timestamp], false)

      const tvsBreakdown = calculateBreakdown(
        config,
        tvs,
        timestamp,
        args.project,
      )

      logger.info(`TVS: ${tvsBreakdown.tvs}`)
      logger.info(`Go to ./scripts/tvs/breakdown.json for more details`)

      fs.writeFileSync(
        './scripts/tvs/breakdown.json',
        JSON.stringify(tvsBreakdown, null, 2),
      )
    }

    process.exit(0)
  },
})

run(cmd, process.argv.slice(2))

function calculateBreakdown(
  config: ProjectTvsConfig,
  tokens: TokenValue[],
  timestamp: UnixTime,
  project: string,
) {
  const tvsBreakdown: TvsBreakdown = {
    tvs: 0,
    source: {
      canonical: {
        value: 0,
        tokens: [],
      },
      external: {
        value: 0,
        tokens: [],
      },
      native: {
        value: 0,
        tokens: [],
      },
    },
    category: {
      ether: 0,
      stablecoin: 0,
      other: 0,
      associated: 0,
    },
  }

  const tokenBreakdown: (TokenValue & {
    priceId: string
    source: string
    category: string
  })[] = []

  for (const token of tokens) {
    tvsBreakdown.tvs += token.valueForProject

    const tokenConfig = config.tokens.find((t) => t.id === token.tokenId)
    assert(tokenConfig, `${token.tokenId} config not found`)

    if (token.amount !== 0) {
      tokenBreakdown.push({
        ...token,
        timestamp,
        priceId: tokenConfig.priceId,
        source: tokenConfig.source,
        category: tokenConfig.category,
      })
    }

    switch (tokenConfig.source) {
      case 'canonical':
        tvsBreakdown.source.canonical.value += token.valueForProject
        tvsBreakdown.source.canonical.tokens.push(token)
        break
      case 'external':
        tvsBreakdown.source.external.value += token.valueForProject
        tvsBreakdown.source.external.tokens.push(token)
        break
      case 'native':
        tvsBreakdown.source.native.value += token.valueForProject
        tvsBreakdown.source.native.tokens.push(token)
        break
      default:
        throw new Error(`Unknown source ${tokenConfig.source}`)
    }

    switch (tokenConfig.category) {
      case 'ether':
        tvsBreakdown.category.ether += token.valueForProject
        break
      case 'stablecoin':
        tvsBreakdown.category.stablecoin += token.valueForProject
        break
      case 'other':
        if (tokenConfig.isAssociated) {
          tvsBreakdown.category.associated += token.valueForProject
        } else {
          tvsBreakdown.category.other += token.valueForProject
        }
        break
      default:
        throw new Error(`Unknown source ${tokenConfig.source}`)
    }
  }

  return {
    project,
    timestamp: UnixTime.toDate(timestamp).toISOString(),
    tvs: toDollarString(tvsBreakdown.tvs),
    source: {
      canonical: {
        value: toDollarString(tvsBreakdown.source.canonical.value),
        tokens: tvsBreakdown.source.canonical.tokens
          .sort((a, b) => b.value - a.value)
          .map((t) => {
            const tokenConfig = config.tokens.find((tt) => tt.id === t.tokenId)
            assert(tokenConfig, `${t.tokenId} config not found`)
            return {
              symbol: tokenConfig.symbol,
              value: '$' + formatNumberWithCommas(t.value),
              amount: formatNumberWithCommas(t.amount),
            }
          }),
      },
      external: {
        value: toDollarString(tvsBreakdown.source.external.value),
        tokens: tvsBreakdown.source.external.tokens
          .sort((a, b) => b.value - a.value)
          .map((t) => {
            const tokenConfig = config.tokens.find((tt) => tt.id === t.tokenId)
            assert(tokenConfig, `${t.tokenId} config not found`)
            return {
              symbol: tokenConfig.symbol,
              value: '$' + formatNumberWithCommas(t.value),
              amount: formatNumberWithCommas(t.amount),
            }
          }),
      },
      native: {
        value: toDollarString(tvsBreakdown.source.native.value),
        tokens: tvsBreakdown.source.native.tokens
          .sort((a, b) => b.value - a.value)
          .map((t) => {
            const tokenConfig = config.tokens.find((tt) => tt.id === t.tokenId)
            assert(tokenConfig, `${t.tokenId} config not found`)
            return {
              symbol: tokenConfig.symbol,
              value: '$' + formatNumberWithCommas(t.value),
              amount: formatNumberWithCommas(t.amount),
            }
          }),
      },
    },
    category: {
      associated: {
        value: toDollarString(tvsBreakdown.category.associated),
        percentage:
          ((tvsBreakdown.category.associated / tvsBreakdown.tvs) * 100).toFixed(
            2,
          ) + '%',
      },
      ether: {
        value: toDollarString(tvsBreakdown.category.ether),
        percentage:
          ((tvsBreakdown.category.ether / tvsBreakdown.tvs) * 100).toFixed(2) +
          '%',
      },
      stablecoin: {
        value: toDollarString(tvsBreakdown.category.stablecoin),
        percentage:
          ((tvsBreakdown.category.stablecoin / tvsBreakdown.tvs) * 100).toFixed(
            2,
          ) + '%',
      },
      other: {
        value: toDollarString(tvsBreakdown.category.other),
        percentage:
          ((tvsBreakdown.category.other / tvsBreakdown.tvs) * 100).toFixed(2) +
          '%',
      },
    },
  }
}

function initLogger(env: Env) {
  const logLevel = env.string('LOG_LEVEL', 'INFO') as LogLevel
  const logger = new Logger({
    logLevel: logLevel,
    transports: [
      {
        transport: console,
        formatter: new LogFormatterPretty(),
      },
    ],
  })
  return logger
}

function toDollarString(value: number) {
  if (value > 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`
  } else if (value > 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`
  } else {
    return `$${value.toFixed(2)}`
  }
}

function readConfig(project: string, logger: Logger): ProjectTvsConfig {
  const filePath = `./src/modules/tvs/config/${project.replace('=', '').replace(';', '')}.json`

  if (!fs.existsSync(filePath)) {
    logger.info(`No TVS config found for ${project}`)
    return {
      projectId: ProjectId(project),
      tokens: [],
    }
  }

  logger.info(`Reading config from file: ${filePath}`)

  const json = JSON.parse(fs.readFileSync(filePath, 'utf8'))

  return {
    projectId: ProjectId(project),
    tokens: json.tokens as Token[],
  }
}

export function formatNumberWithCommas(value: number, precision = 2): string {
  const formattedNumber = value.toLocaleString('en-US', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  })

  return formattedNumber
}
