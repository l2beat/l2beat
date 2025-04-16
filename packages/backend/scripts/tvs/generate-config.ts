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
import { assert, ProjectId, type TokenId, UnixTime } from '@l2beat/shared-pure'
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
import { LocalStorage } from '../../src/modules/tvs/tools/LocalStorage'
import { isInTokenSyncRange } from '../../src/modules/tvs/tools/getTokenSyncRange'
import { mapConfig } from '../../src/modules/tvs/tools/mapConfig'

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
    const localStorage = new LocalStorage('./scripts/tvs/local-data.json')
    const localExecutor = new LocalExecutor(ps, env, logger, localStorage)
    const timestamp =
      UnixTime.toStartOf(UnixTime.now(), 'hour') - 2 * UnixTime.HOUR

    let projects: Project<'tvlConfig', 'chainConfig' | 'isBridge'>[] | undefined

    const start = Date.now()

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

    logger.info(`Generating new TVS config for projects (${projects.length})`)
    const regeneratedProjects = await Promise.all(
      projects.map(async (project) => {
        return await generateConfigForProject(
          project,
          chains,
          logger,
          localStorage,
        )
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

    for (const project of regeneratedProjects) {
      let newConfig: TvsToken[] = []
      const filePath = `./../config/src/tvs/json/${project.projectId.replace('=', '').replace(';', '')}.json`

      if (project.tokens.length > 0) {
        const tvsForProject = tvs.get(project.projectId)
        assert(tvsForProject)

        const projectConfig = projects.find((p) => p.id === project.projectId)
        assert(projectConfig, `${project.projectId} config not found`)

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

      const currentConfig = readFromFile(filePath)
      const mergedTokens = mergeWithExistingConfig(
        newConfig,
        currentConfig,
        logger,
      )

      if (mergedTokens.length > 0) {
        writeToFile(filePath, project.projectId, mergedTokens)
      }
    }

    const duration = (Date.now() - start) / 1000
    logger.info(`TVS config generation completed in ${duration.toFixed(2)}s`)
    process.exit(0)
  },
})

run(cmd, process.argv.slice(2))

async function generateConfigForProject(
  project: Project<'tvlConfig', 'chainConfig'>,
  chains: Map<string, ChainConfig>,
  logger: Logger,
  localStorage: LocalStorage,
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

  return mapConfig(project, chains, logger, localStorage, rpc)
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
  nonZeroTokens: TvsToken[],
  currentConfig: TvsToken[],
  logger: Logger,
) {
  const resultMap = new Map<string, TvsToken>()
  nonZeroTokens.forEach((token) => {
    if (resultMap.has(token.id)) {
      logger.warn(`Duplicate detected: ${token.id}`)
      token.id = (token.id + '-duplicate') as TokenId
    }

    resultMap.set(token.id, token)
  })

  const customTokens = currentConfig.filter((t) => t.mode === 'custom')
  customTokens.forEach((token) => {
    resultMap.set(token.id, token)
  })

  return Array.from(resultMap.values()).sort((a, b) => a.id.localeCompare(b.id))
}
