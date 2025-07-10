import {
  type Env,
  getEnv,
  LogFormatterPretty,
  Logger,
  type LogLevel,
} from '@l2beat/backend-tools'
import { ProjectService, type TvsToken } from '@l2beat/config'
import { CoingeckoClient, HttpClient } from '@l2beat/shared'
import { assert, CoingeckoId, ProjectId } from '@l2beat/shared-pure'
import { command, run } from 'cmd-ts'
import * as fs from 'fs'

const cmd = command({
  name: 'add-icon-url',
  args: {},
  handler: async () => {
    const env = getEnv()
    const logger = initLogger(env)
    const ps = new ProjectService()
    const projects = await ps.getProjects({
      select: ['tvsConfig'],
    })
    const coingeckoApiKey = env.optionalString('COINGECKO_API_KEY')
    const coingeckoClient = new CoingeckoClient({
      apiKey: coingeckoApiKey,
      retryStrategy: 'RELIABLE',
      logger,
      callsPerMinute: coingeckoApiKey ? 400 : 10,
      http: new HttpClient(),
      sourceName: 'coingecko',
    })

    const coingeckoIds = new Set(
      projects.flatMap((p) => p.tvsConfig).map((t) => t.priceId),
    )
    const iconMap = new Map<string, string>()

    await Promise.all(
      Array.from(coingeckoIds.values()).map(async (c) => {
        const imageUrl = await coingeckoClient.getImageUrl(CoingeckoId(c))
        iconMap.set(c, imageUrl)
      }),
    )

    for (const project of projects) {
      logger.info(`Changing TVS config schema for project ${project.id}`)
      const newConfig: TvsToken[] = project.tvsConfig.map((t) => {
        if (t.iconUrl) return t
        const iconUrl = iconMap.get(t.priceId)
        assert(iconUrl, `Missing icon for ${t.priceId}`)
        return { ...t, iconUrl }
      })
      const filePath = `./../config/src/tvs/json/${project.id.replace('=', '').replace(';', '')}.json`

      logger.info(`Writing results to file: ${filePath}`)
      writeToFile(filePath, project.id, newConfig)
    }

    process.exit(0)
  },
})

run(cmd, process.argv.slice(2))

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

function writeToFile(filePath: string, project: string, tokens: TvsToken[]) {
  const wrapper = {
    $schema: 'schema/tvs-config-schema.json',
    projectId: ProjectId(project),
    tokens: tokens,
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
