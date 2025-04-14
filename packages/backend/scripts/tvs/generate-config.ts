import * as fs from 'fs'
import {
  type Env,
  LogFormatterPretty,
  type LogLevel,
  Logger,
  getEnv,
} from '@l2beat/backend-tools'
import {
  type ChainConfig,
  type Project,
  ProjectService,
  type TvsToken,
} from '@l2beat/config'
import { HttpClient, RpcClient } from '@l2beat/shared'
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
import { isInTokenSyncRange } from '../../src/modules/tvs/tools/getTokenSyncRange'
import { mapConfig } from '../../src/modules/tvs/tools/mapConfig'
import type { TvsProjectBreakdown } from '../../src/modules/tvs/types'

const args = {
  project: positional({
    type: optional(string),
    displayName: 'projectId',
    description: 'Project for which tvs config will be generated',
  }),
  includeZeroAmounts: flag({
    type: boolean,
    long: 'include-zero-amounts',
    short: 'iza',
    description: 'Include zero amounts in the config',
  }),
}

const cmd = command({
  name: 'generate-tvs-config',
  args,
  handler: async (args) => {
    const env = getEnv()
    const logger = initLogger(env)
    const ps = new ProjectService()
    const localExecutor = new LocalExecutor(ps, env, logger)
    const timestamp =
      UnixTime.toStartOf(UnixTime.now(), 'hour') - 3 * UnixTime.HOUR

    let projects: Project<'tvlConfig', 'chainConfig' | 'isBridge'>[] | undefined

    if (!args.project) {
      projects = await ps.getProjects({
        select: ['tvlConfig'],
        optional: ['chainConfig', 'isBridge'],
      })

      if (!projects) {
        logger.error('No TVS projects found')
        process.exit(1)
      }
    } else {
      const project = await ps.getProject({
        id: ProjectId(args.project),
        select: ['tvlConfig'],
        optional: ['chainConfig', 'isBridge'],
      })

      if (!project) {
        logger.error(`Project '${args.project}' not found`)
        process.exit(1)
      }

      projects = [project]
    }

    const projectsWithChain = (
      await ps.getProjects({ select: ['chainConfig'] })
    ).map((p) => p.chainConfig)

    const chains = new Map(projectsWithChain.map((p) => [p.name, p]))

    logger.info(`Generating new TVS config for projects`)
    const regeneratedProjects = await Promise.all(
      projects.map(async (project) => {
        const newConfig = await generateConfigForProject(
          project,
          chains,
          logger,
        )
        // we need to read the current config to include custom tokens
        const currentConfig = readFromFile(getProjectConfigFilePath(project.id))

        return {
          ...newConfig,
          tokens: mergeWithExistingConfig(newConfig.tokens, currentConfig),
        }
      }),
    )

    logger.info('Executing TVS to exclude zero-valued tokens')
    const tvs = await localExecutor.getTvs(
      regeneratedProjects.map((p) => ({
        ...p,
        tokens: p.tokens.filter((token) =>
          isInTokenSyncRange(token, timestamp),
        ),
      })),
      timestamp,
      false,
    )

    const projectBreakdown: TvsProjectBreakdown = {
      scalingTvs: 0,
      scalingProjects: [],
      bridgesTvs: 0,
      bridgesProjects: [],
    }

    for (const project of regeneratedProjects) {
      let newConfig: TvsToken[] = []
      const filePath = getProjectConfigFilePath(project.projectId)

      if (project.tokens.length > 0) {
        const tvsForProject = tvs.get(project.projectId)
        assert(tvsForProject)

        const valueForProject = tvsForProject.reduce((acc, token) => {
          return acc + token.valueForProject
        }, 0)

        const valueForSummary = tvsForProject.reduce((acc, token) => {
          return acc + token.valueForSummary
        }, 0)

        const projectConfig = projects.find((p) => p.id === project.projectId)
        assert(projectConfig, `${project.projectId} config not found`)

        if (projectConfig.isBridge) {
          projectBreakdown.bridgesTvs += valueForSummary
          projectBreakdown.bridgesProjects.push({
            projectId: project.projectId,
            value: valueForProject,
          })
        } else {
          projectBreakdown.scalingTvs += valueForSummary
          projectBreakdown.scalingProjects.push({
            projectId: project.projectId,
            value: valueForProject,
          })
        }

        newConfig = tvsForProject
          .filter((token) => token.value !== 0 || args.includeZeroAmounts)
          .map((token) => token.tokenId)
          .sort((a, b) => a.localeCompare(b))
          .map((tokenId) => {
            const tokenConfig = project.tokens.find((t) => t.id === tokenId)
            assert(tokenConfig, `${tokenId} config not found`)
            return tokenConfig
          })
      } else {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
        }
      }

      // we need to merge 2nd time to make sure custom tokens where not removed
      const currentConfig = readFromFile(filePath)
      const mergedTokens = mergeWithExistingConfig(newConfig, currentConfig)

      if (mergedTokens.length > 0) {
        writeToFile(filePath, project.projectId, mergedTokens)
      }
    }

    logger.info(
      `TVS for scaling projects ${toDollarString(projectBreakdown.scalingTvs)}`,
    )
    logger.info(
      `TVS for bridges ${toDollarString(projectBreakdown.bridgesTvs)}`,
    )
    logger.info(`Go to ./scripts/tvs/breakdown.json for more details`)

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

    process.exit(0)
  },
})

run(cmd, process.argv.slice(2))

async function generateConfigForProject(
  project: Project<'tvlConfig', 'chainConfig'>,
  chains: Map<string, ChainConfig>,
  logger: Logger,
) {
  const env = getEnv()

  const rpcApi = project.chainConfig?.apis.find((a) => a.type === 'rpc')
  const rpc = rpcApi
    ? new RpcClient({
        http: new HttpClient(),
        callsPerMinute: env.integer(
          `${project.id.toUpperCase()}_RPC_CALLS_PER_MINUTE`,
          rpcApi.callsPerMinute ?? 120,
        ),
        retryStrategy: 'RELIABLE',
        logger,
        url: env.string(`${project.id.toUpperCase()}_RPC_URL`, rpcApi.url),
        sourceName: project.id,
      })
    : undefined

  return mapConfig(project, chains, logger, rpc)
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

function writeToFile(
  filePath: string,
  project: string,
  nonZeroTokens: TvsToken[],
) {
  const wrapper = {
    $schema: 'schema/tvs-config-schema.json',
    projectId: ProjectId(project),
    tokens: nonZeroTokens,
  }

  fs.writeFileSync(
    filePath,
    JSON.stringify(
      wrapper,
      (_, v) => (typeof v === 'bigint' ? v.toString() : v),
      2,
    ) + '\n',
  )
}

function readFromFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    return []
  }

  const json = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  return json.tokens as TvsToken[]
}

function mergeWithExistingConfig(
  newConfig: TvsToken[],
  currentConfig: TvsToken[],
) {
  const resultMap = new Map<string, TvsToken>()
  newConfig.forEach((token) => {
    assert(!resultMap.has(token.id), `Duplicate token ${token.id} found`)
    resultMap.set(token.id, token)
  })

  const customTokens = currentConfig.filter((t) => t.mode === 'custom')
  customTokens.forEach((token) => {
    resultMap.set(token.id, token)
  })

  return Array.from(resultMap.values()).sort((a, b) => a.id.localeCompare(b.id))
}

function toDollarString(value: number) {
  if (value > 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`
  } else if (value > 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`
  } else {
    return `$${value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }
}

function getProjectConfigFilePath(projectId: string) {
  return `./../config/src/tvs/json/${projectId.replace('=', '').replace(';', '')}.json`
}
