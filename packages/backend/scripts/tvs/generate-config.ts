import * as fs from 'fs'
import {
  type Env,
  LogFormatterPretty,
  type LogLevel,
  Logger,
  getEnv,
} from '@l2beat/backend-tools'
import { ProjectService } from '@l2beat/config'
// TODO: This script should probably be part of config
import { getTokenData } from '@l2beat/config/src/tokens/getTokenData'
import { HttpClient, RpcClient } from '@l2beat/shared'
import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { command, optional, positional, run, string } from 'cmd-ts'
import { LocalExecutor } from '../../src/modules/tvs/LocalExecutor'
import { mapConfig } from '../../src/modules/tvs/mapConfig'
import type { Token } from '../../src/modules/tvs/types'

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

    logger.info(
      'Generating TVS config ' +
        (args.project ? `for project '${args.project}'` : ''),
    )

    // get token data
    logger.info('Executing token script')
    const sourceFilePath = '../../packages/config/src/tokens/tokens.jsonc'
    const outputFilePath = '../../packages/config/src/tokens/generated.json'
    await getTokenData(sourceFilePath, outputFilePath)

    if (!args.project) {
      return
    }

    const tvsConfig = await generateConfigForProject(ps, args.project, logger)

    logger.info('Executing TVS to exclude zero-valued tokens')
    const timestamp =
      UnixTime.toStartOf(UnixTime.now(), 'hour') - 3 * UnixTime.HOUR
    const localExecutor = new LocalExecutor(ps, env, logger)
    const tvs = await localExecutor.run(tvsConfig, [timestamp], true)

    const nonZeroTokens = tvs
      .get(timestamp)
      ?.filter((token) => token.value !== 0)
      // TODO replace with amountId matching
      .map((token) => token.tokenConfig)

    assert(nonZeroTokens, 'No data for timestamp')

    // write to file
    writeToFile(args.project, nonZeroTokens, logger)
    process.exit(0)
  },
})

run(cmd, process.argv.slice(2))

async function generateConfigForProject(
  ps: ProjectService,
  projectId: string,
  logger: Logger,
) {
  const project = await ps.getProject({
    id: ProjectId(projectId),
    select: ['tvlConfig'],
    optional: ['chainConfig'],
  })
  assert(project, `${projectId}: No project found`)

  const env = getEnv()
  const rpc = project.chainConfig
    ? new RpcClient({
        http: new HttpClient(),
        callsPerMinute: env.integer(
          `${projectId.toUpperCase()}_RPC_CALLS_PER_MINUTE`,
          120,
        ),
        retryStrategy: 'RELIABLE',
        logger,
        url: env.string(
          `${projectId.toUpperCase()}_RPC_URL`,
          project.chainConfig.apis.find((a) => a.type === 'rpc')?.url,
        ),
        sourceName: projectId,
      })
    : undefined

  assert(project, `${projectId} project not found`)
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

function writeToFile(project: string, nonZeroTokens: Token[], logger: Logger) {
  const filePath = `./src/modules/tvs/config/${project}.json`
  logger.info(`Writing results to file: ${filePath}`)
  const wrapper = {
    $schema: 'schema/tvs-config-schema.json',
    projectId: ProjectId(project),
    tokens: nonZeroTokens,
  }

  fs.writeFileSync(filePath, JSON.stringify(wrapper, null, 2))
}
