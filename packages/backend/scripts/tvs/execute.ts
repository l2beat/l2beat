import { type Env, getEnv, Logger, type LogLevel } from '@l2beat/backend-tools'
import { ProjectService, type TvsToken } from '@l2beat/config'
import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import {
  boolean,
  command,
  flag,
  number,
  option,
  optional,
  positional,
  run,
  string,
} from 'cmd-ts'
import * as fs from 'fs'
import { getEffectiveConfig } from '../../src/modules/tvs/tools/getEffectiveConfig'
import { LocalExecutor } from '../../src/modules/tvs/tools/LocalExecutor'
import { LocalStorage } from '../../src/modules/tvs/tools/LocalStorage'
import type {
  TokenValue,
  TvsBreakdown,
  TvsProjectBreakdown,
} from '../../src/modules/tvs/types'

// we have disabled TVS for some projects using feature flags on HEROKU
// as this script will be phased out soon we decided to hardcode it here
const DISABLED_PROJECTS = ['kroma', 'treasure', 'real']

const args = {
  project: positional({
    type: optional(string),
    displayName: 'projectId',
    description: 'Project for which tvs will be executed',
  }),
  timestamp: option({
    type: optional(number),
    long: 'timestamp',
    short: 't',
    description: 'Timestamp to use for TVS calculation',
  }),
  latestMode: flag({
    type: boolean,
    long: 'latest',
    short: 'l',
    description: 'Run in latest mode',
  }),
}

const cmd = command({
  name: 'execute',
  args,
  handler: async (args) => {
    const env = getEnv()
    const logger = initLogger(env)
    const ps = new ProjectService()
    const localStorage = new LocalStorage('./scripts/tvs/local-data.json')
    const localExecutor = new LocalExecutor(ps, env, logger, localStorage)

    const start = Date.now()

    const timestampForTvs = args.timestamp
      ? UnixTime.toStartOf(args.timestamp, 'hour')
      : UnixTime.toStartOf(UnixTime.now(), 'hour') - 2 * UnixTime.HOUR

    logger.info(
      `Using timestamp ${timestampForTvs.toString()} (${new Date(timestampForTvs * 1000).toUTCString()})`,
    )

    if (!args.project) {
      let projects = await ps.getProjects({
        select: ['tvsConfig'],
        optional: ['chainConfig', 'isBridge'],
      })

      projects = projects.filter((p) => !DISABLED_PROJECTS.includes(p.id))

      if (!projects) {
        logger.error('No TVS projects found')
        process.exit(1)
      }

      logger.info(`Found ${projects.length} TVS projects`)

      logger.info('Executing TVS config for projects')
      const tvs = await localExecutor.getTvs(
        projects
          .filter((p) => p.tvsConfig.length > 0)
          .map((p) => ({
            projectId: p.id,
            tokens: getEffectiveConfig(p.tvsConfig, timestampForTvs, false),
          })),
        args.latestMode ? UnixTime.now() : timestampForTvs,
        args.latestMode,
      )

      const projectBreakdown: TvsProjectBreakdown = {
        scalingTvs: 0,
        scalingProjects: [],
        bridgesTvs: 0,
        bridgesProjects: [],
      }

      for (const project of projects.filter((p) => p.tvsConfig.length > 0)) {
        const tvsForProject = tvs.get(project.id)
        assert(tvsForProject)

        const valueForProject = tvsForProject.reduce((acc, token) => {
          return acc + token.valueForProject
        }, 0)

        const valueForSummary = tvsForProject.reduce((acc, token) => {
          return acc + token.valueForSummary
        }, 0)

        if (project.isBridge) {
          projectBreakdown.bridgesTvs += valueForSummary
          projectBreakdown.bridgesProjects.push({
            projectId: project.id,
            value: valueForProject,
          })
        } else {
          projectBreakdown.scalingTvs += valueForSummary
          projectBreakdown.scalingProjects.push({
            projectId: project.id,
            value: valueForProject,
          })
        }
      }

      logger.info(
        `TVS for scaling projects ${toDollarString(projectBreakdown.scalingTvs)}`,
      )
      logger.info(
        `TVS for bridges ${toDollarString(projectBreakdown.bridgesTvs)}`,
      )
      logger.info('Go to ./scripts/tvs/breakdown.json for more details')

      fs.writeFileSync(
        './scripts/tvs/breakdown.json',
        JSON.stringify(
          {
            scalingTvs: toDollarString(projectBreakdown.scalingTvs),
            scalingProjects: projectBreakdown.scalingProjects.map((p) => ({
              projectId: p.projectId,
              value: toDollarString(p.value),
            })),
            bridgesTvs: toDollarString(projectBreakdown.bridgesTvs),
            bridgesProjects: projectBreakdown.bridgesProjects.map((p) => ({
              projectId: p.projectId,
              value: toDollarString(p.value),
            })),
          },
          null,
          2,
        ),
      )
    } else {
      if (DISABLED_PROJECTS.includes(args.project)) {
        logger.error(`TVS for project '${args.project}' is disabled`)
        process.exit(1)
      }

      const project = await ps.getProject({
        id: ProjectId(args.project),
        select: ['tvsConfig'],
        optional: ['chainConfig'],
      })

      if (!project) {
        logger.error(`Project '${args.project}' not found`)
        process.exit(1)
      }

      const effectiveConfig = getEffectiveConfig(
        project.tvsConfig,
        timestampForTvs,
        false,
      )

      const tvs = await localExecutor.getTvs(
        [
          {
            projectId: project.id,
            tokens: effectiveConfig,
          },
        ],
        args.latestMode ? UnixTime.now() : timestampForTvs,
        args.latestMode,
      )
      const tvsForProject = tvs.get(project.id)
      assert(tvsForProject)

      const tvsBreakdown = calculateBreakdown(
        project.tvsConfig,
        tvsForProject,
        timestampForTvs,
        args.project,
      )

      logger.info(`TVS: ${tvsBreakdown.tvs}`)
      logger.info('Go to ./scripts/tvs/breakdown.json for more details')

      fs.writeFileSync(
        './scripts/tvs/breakdown.json',
        JSON.stringify(tvsBreakdown, null, 2),
      )
    }

    const duration = (Date.now() - start) / 1000
    logger.info(`TVS execution completed in ${duration.toFixed(2)}s`)

    process.exit(0)
  },
})

run(cmd, process.argv.slice(2))

function calculateBreakdown(
  config: TvsToken[],
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
      btc: 0,
      rwaPublic: 0,
      rwaRestricted: 0,
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

    const tokenConfig = config.find((t) => t.id === token.tokenId)
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
        tvsBreakdown.category.other += token.valueForProject
        break
      case 'btc':
        tvsBreakdown.category.btc += token.valueForProject
        break
      case 'rwaPublic':
        tvsBreakdown.category.rwaPublic += token.valueForProject
        break
      case 'rwaRestricted':
        tvsBreakdown.category.rwaRestricted += token.valueForProject
        break
      default:
        throw new Error(`Unknown source ${tokenConfig.source}`)
    }

    if (tokenConfig.isAssociated) {
      tvsBreakdown.category.associated += token.valueForProject
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
            const tokenConfig = config.find((tt) => tt.id === t.tokenId)
            assert(tokenConfig, `${t.tokenId} config not found`)
            return {
              symbol: tokenConfig.symbol,
              amount: formatNumberWithCommas(t.amount),
              value: '$' + formatNumberWithCommas(t.value),
              ...(t.valueForProject !== t.value
                ? {
                    valueForProject:
                      '$' + formatNumberWithCommas(t.valueForProject),
                  }
                : {}),
              ...(t.valueForSummary !== t.valueForProject
                ? {
                    valueForSummary:
                      '$' + formatNumberWithCommas(t.valueForSummary),
                  }
                : {}),
            }
          }),
      },
      external: {
        value: toDollarString(tvsBreakdown.source.external.value),
        tokens: tvsBreakdown.source.external.tokens
          .sort((a, b) => b.value - a.value)
          .map((t) => {
            const tokenConfig = config.find((tt) => tt.id === t.tokenId)
            assert(tokenConfig, `${t.tokenId} config not found`)
            return {
              symbol: tokenConfig.symbol,
              amount: formatNumberWithCommas(t.amount),
              value: '$' + formatNumberWithCommas(t.value),
              ...(t.valueForProject !== t.value
                ? {
                    valueForProject:
                      '$' + formatNumberWithCommas(t.valueForProject),
                  }
                : {}),
              ...(t.valueForSummary !== t.valueForProject
                ? {
                    valueForSummary:
                      '$' + formatNumberWithCommas(t.valueForSummary),
                  }
                : {}),
            }
          }),
      },
      native: {
        value: toDollarString(tvsBreakdown.source.native.value),
        tokens: tvsBreakdown.source.native.tokens
          .sort((a, b) => b.value - a.value)
          .map((t) => {
            const tokenConfig = config.find((tt) => tt.id === t.tokenId)
            assert(tokenConfig, `${t.tokenId} config not found`)
            return {
              symbol: tokenConfig.symbol,
              amount: formatNumberWithCommas(t.amount),
              value: '$' + formatNumberWithCommas(t.value),
              ...(t.valueForProject !== t.value
                ? {
                    valueForProject:
                      '$' + formatNumberWithCommas(t.valueForProject),
                  }
                : {}),
              ...(t.valueForSummary !== t.valueForProject
                ? {
                    valueForSummary:
                      '$' + formatNumberWithCommas(t.valueForSummary),
                  }
                : {}),
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
      btc: {
        value: toDollarString(tvsBreakdown.category.btc),
        percentage:
          ((tvsBreakdown.category.btc / tvsBreakdown.tvs) * 100).toFixed(2) +
          '%',
      },
      rwaPublic: {
        value: toDollarString(tvsBreakdown.category.rwaPublic),
        percentage:
          ((tvsBreakdown.category.rwaPublic / tvsBreakdown.tvs) * 100).toFixed(
            2,
          ) + '%',
      },
      rwaRestricted: {
        value: toDollarString(tvsBreakdown.category.rwaRestricted),
        percentage:
          (
            (tvsBreakdown.category.rwaRestricted / tvsBreakdown.tvs) *
            100
          ).toFixed(2) + '%',
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
  return new Logger({
    level: env.string('LOG_LEVEL', 'INFO') as LogLevel,
  })
}

function toDollarString(value: number) {
  if (value > 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`
  }
  if (value > 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`
  }
  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function formatNumberWithCommas(value: number, precision = 2): string {
  const formattedNumber = value.toLocaleString('en-US', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  })

  return formattedNumber
}
