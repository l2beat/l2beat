import * as fs from 'fs'
import {
  type Env,
  LogFormatterPretty,
  type LogLevel,
  Logger,
  getEnv,
} from '@l2beat/backend-tools'
import { type Project, ProjectService } from '@l2beat/config'
// TODO: This script should probably be part of config
import { getTokenData } from '@l2beat/config/src/tokens/getTokenData'
import { HttpClient, RpcClient } from '@l2beat/shared'
import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { command, optional, positional, run, string } from 'cmd-ts'
import { LocalExecutor } from '../../src/modules/tvs/LocalExecutor'
import { mapConfig } from '../../src/modules/tvs/mapConfig'
import type { Token } from '../../src/modules/tvs/types'

// some projects are VERY slow to sync, to get config for them you need to run this script with the project name as an argument
const PROJECTS_TO_SKIP = ['silicon']

const args = {
  project: positional({
    type: optional(string),
    displayName: 'projectId',
    description: 'Project for which tvs will be executed',
  }),
}

const cmd = command({
  name: 'generate-tvs-config',
  args,
  handler: async (args) => {
    const env = getEnv()
    const logger = initLogger(env)
    const ps = new ProjectService()

    // get token data
    logger.info('Executing token script')
    const sourceFilePath = '../../packages/config/src/tokens/tokens.jsonc'
    const outputFilePath = '../../packages/config/src/tokens/generated.json'
    await getTokenData(sourceFilePath, outputFilePath)

    let projects: Project<'tvlConfig', 'chainConfig'>[] | undefined

    if (!args.project) {
      projects = await ps.getProjects({
        select: ['tvlConfig'],
        optional: ['chainConfig'],
      })

      if (!projects) {
        logger.error('No TVS projects found')
        process.exit(1)
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

      projects = [project]
    }

    for (const project of projects) {
      if (!args.project && PROJECTS_TO_SKIP.includes(project.id)) {
        logger.info(`Skipping project ${project.id}`)
        continue
      }

      logger.info(`Generating TVS config for project ${project.id}`)
      const tvsConfig = await generateConfigForProject(project, logger)

      logger.info('Executing TVS to exclude zero-valued tokens')
      const timestamp =
        UnixTime.toStartOf(UnixTime.now(), 'hour') - 3 * UnixTime.HOUR
      const localExecutor = new LocalExecutor(ps, env, logger)
      const tvs = await localExecutor.run(tvsConfig, [timestamp], true)

      const currentTvs = tvs
        .get(timestamp)
        ?.filter((token) => token.value !== 0)
        .map((token) => token.tokenConfig)
        .sort((a, b) => a.id.localeCompare(b.id))

      assert(currentTvs, 'No data for timestamp')

      // =nil;
      const filePath = `./src/modules/tvs/config/${project.id.replace('=', '').replace(';', '')}.json`
      writeToFile(filePath, project.id, currentTvs)

      const currentConfig = readFromFile(filePath)
      const mergedTokens = mergeWithExistingConfig(
        currentTvs,
        currentConfig,
        logger,
      )

      logger.info(`Writing results to file: ${filePath}`)
      writeToFile(filePath, project.id, mergedTokens)
    }

    process.exit(0)
  },
})

run(cmd, process.argv.slice(2))

async function generateConfigForProject(
  project: Project<'tvlConfig', 'chainConfig'>,
  logger: Logger,
) {
  const env = getEnv()

  const rpcUrl = project.chainConfig?.apis.find((a) => a.type === 'rpc')?.url
  const rpc = rpcUrl
    ? new RpcClient({
      http: new HttpClient(),
      callsPerMinute: env.integer(
        `${project.id.toUpperCase()}_RPC_CALLS_PER_MINUTE`,
        120,
      ),
      retryStrategy: 'RELIABLE',
      logger,
      url: env.string(`${project.id.toUpperCase()}_RPC_URL`, rpcUrl),
      sourceName: project.id,
    })
    : undefined

  return mapConfig(project, logger, rpc)
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
  nonZeroTokens: Token[],
) {
  const wrapper = {
    $schema: 'schema/tvs-config-schema.json',
    projectId: ProjectId(project),
    tokens: nonZeroTokens,
  }

  fs.writeFileSync(filePath, JSON.stringify(wrapper, null, 2) + '\n')
}

function readFromFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    return []
  }

  const json = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  return json.tokens as Token[]
}

function mergeWithExistingConfig(
  nonZeroTokens: Token[],
  currentConfig: Token[],
  logger: Logger,
) {
  const resultMap = new Map<string, Token>()
  nonZeroTokens.forEach((token) => {
    if (resultMap.has(token.id)) {
      logger.warn(`Duplicate detected: ${token.id}`)
      resultMap.set(token.id + '-duplicate', token)
      return
    }
    resultMap.set(token.id, token)
  })

  const customTokens = currentConfig.filter((t) => t.mode === 'custom')
  customTokens.forEach((token) => {
    resultMap.set(token.id, token)
  })

  return Array.from(resultMap.values()).sort((a, b) => a.id.localeCompare(b.id))
}
