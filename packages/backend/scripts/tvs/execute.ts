import * as fs from 'fs'
import {
  type Env,
  LogFormatterPretty,
  type LogLevel,
  Logger,
  getEnv,
} from '@l2beat/backend-tools'
import { ProjectService } from '@l2beat/config'
import {} from '@l2beat/shared'
import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { command, positional, run, string } from 'cmd-ts'
import { LocalExecutor } from '../../src/modules/tvs/LocalExecutor'
import type {
  Token,
  TokenValue,
  TvsBreakdown,
  TvsConfig,
} from '../../src/modules/tvs/types'

const args = {
  project: positional({
    type: string,
    displayName: 'projectId',
    description: 'Project for which tvs will be executed',
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

    const timestamp = UnixTime.now().toStartOf('hour').add(-3, 'hours')

    const tokens = readConfig(args.project, logger)
    const config = {
      projectId: ProjectId(args.project),
      tokens,
    } as TvsConfig

    const tvs = await localExecutor.run(config, [timestamp], false)

    fs.writeFileSync(
      './src/modules/tvs/breakdown.json',
      JSON.stringify(
        {
          project: args.project,
          values: tvs.get(timestamp.toNumber()),
        },
        null,
        2,
      ) + '\n',
    )

    outputTVS(tvs, timestamp, logger)

    process.exit(0)
  },
})

run(cmd, process.argv.slice(2))

function outputTVS(
  tvs: Map<number, TokenValue[]>,
  timestamp: UnixTime,
  logger: Logger,
) {
  const tokens = tvs.get(timestamp.toNumber())
  assert(tokens, 'No data for timestamp')

  const tvsBreakdown: TvsBreakdown = {
    total: 0,
    source: {
      canonical: 0,
      external: 0,
      native: 0,
    },
    category: {
      ether: 0,
      stablecoin: 0,
      other: 0,
    },
  }

  const tokenBreakdown: (Omit<TokenValue, 'tokenConfig'> & {
    priceId: string
    source: string
    category: string
  })[] = []

  const filteredConfig: Token[] = []

  for (const token of tokens) {
    tvsBreakdown.total += token.valueForProject

    if (token.amount !== 0) {
      filteredConfig.push(token.tokenConfig)

      tokenBreakdown.push({
        projectId: token.projectId,
        amount: token.amount,
        value: token.value,
        valueForProject: token.valueForProject,
        valueForTotal: token.valueForTotal,
        priceId: token.tokenConfig.priceId,
        source: token.tokenConfig.source,
        category: token.tokenConfig.category,
      })
    }

    switch (token.tokenConfig.source) {
      case 'canonical':
        tvsBreakdown.source.canonical += token.valueForProject
        break
      case 'external':
        tvsBreakdown.source.external += token.valueForProject
        break
      case 'native':
        tvsBreakdown.source.native += token.valueForProject
        break
      default:
        throw new Error(`Unknown source ${token.tokenConfig.source}`)
    }

    switch (token.tokenConfig.category) {
      case 'ether':
        tvsBreakdown.category.ether += token.valueForProject
        break
      case 'stablecoin':
        tvsBreakdown.category.stablecoin += token.valueForProject
        break
      case 'other':
        tvsBreakdown.category.other += token.valueForProject
        break
      default:
        throw new Error(`Unknown source ${token.tokenConfig.source}`)
    }
  }

  // output TVS breakdown
  logger.info(
    JSON.stringify(
      tvsBreakdown,
      (_, v) => {
        if (typeof v === 'number') {
          return toDollarString(v)
        }
        return v
      },
      2,
    ),
  )
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

function readConfig(project: string, logger: Logger) {
  const filePath = `./src/modules/tvs/config/${project}.json`
  logger.info(`reading config from file: ${filePath}`)

  const json = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  return json.tokens as Token[]
}
