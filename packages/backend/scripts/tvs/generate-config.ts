import * as fs from 'fs'
import {
  type Env,
  LogFormatterPretty,
  type LogLevel,
  Logger,
  getEnv,
} from '@l2beat/backend-tools'
import { ProjectService, getTokenData } from '@l2beat/config'
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

    // generate config
    const tvsConfig = await generateConfigForProject(ps, args.project)

    logger.info('Executing TVS to exclude zero-valued tokens')
    const timestamp = UnixTime.now().toStartOf('hour').add(-3, 'hours')
    const localExecutor = new LocalExecutor(ps, env, logger)
    const tvs = await localExecutor.run(tvsConfig, [timestamp], true)

    const nonZeroTokens = tvs
      .get(timestamp.toNumber())
      ?.filter((token) => token.value !== 0)
      // TODO replace with amountId matching
      .map((token) => token.tokenConfig)

    assert(nonZeroTokens, 'No data for timestamp')

    // write to file
    writeToFile(nonZeroTokens, logger)
    process.exit(0)
  },
})

run(cmd, process.argv.slice(2))

async function generateConfigForProject(ps: ProjectService, projectId: string) {
  const project = await ps.getProject({
    id: ProjectId(projectId),
    select: ['tvlConfig', 'chainConfig'],
  })
  assert(project, `${projectId} project not found`)
  return mapConfig(project, project.chainConfig)
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

function writeToFile(nonZeroTokens: Token[], logger: Logger) {
  const filePath = `./src/modules/tvs/config/${args.project}.json`
  logger.info(`Writing results to file: ${filePath}`)
  const wrapper = {
    $schema: 'schema/tvs-config-schema.json',
    projectId: args.project,
    tokens: nonZeroTokens,
  }

  fs.writeFileSync(filePath, JSON.stringify(wrapper, null, 2))
}
