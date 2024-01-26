import { Env, LoggerOptions } from '@l2beat/backend-tools'
import { Config } from './Config'
import { bridges, chains, layer2s, tokenList } from '@l2beat/config'
import { bridgeToProject, layer2ToProject } from '../model'
import { UnixTime } from '@l2beat/shared-pure'
import { getGitCommitHash } from './getGitCommitHash'
import { getChainTvlConfig } from './getChainTvlConfig'
import { getChainsWithTokens } from './getChainsWithTokens'

interface Settings {
  name: string
  isLocal?: boolean
  minTimestampOverride?: UnixTime
}

export function makeConfig(
  env: Env,
  settings: Settings,
): Pick<
  Config,
  | 'name'
  | 'projects'
  | 'tokens'
  | 'logger'
  | 'logThrottler'
  | 'clock'
  | 'database'
  | 'api'
  | 'health'
  | 'metricsAuth'
  | 'tvl'
> {
  const minBlockTimestamp =
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    chains.find((c) => c.name === 'ethereum')!.minTimestampForTvl!

  return {
    name: settings.name,
    projects: layer2s.map(layer2ToProject).concat(bridges.map(bridgeToProject)),
    tokens: tokenList,
    logger: {
      logLevel: env.string('LOG_LEVEL', 'INFO') as LoggerOptions['logLevel'],
      format: settings.isLocal ? 'pretty' : 'json',
      utc: settings.isLocal ? false : true,
      colors: settings.isLocal ? true : false,
    },
    logThrottler: settings.isLocal
      ? false
      : {
          callsUntilThrottle: 4,
          clearIntervalMs: 5000,
          throttleTimeMs: 20000,
        },
    clock: {
      minBlockTimestamp: settings.minTimestampOverride ?? minBlockTimestamp,
      safeTimeOffsetSeconds: 60 * 60,
    },
    database: settings.isLocal
      ? {
          connection: env.string('LOCAL_DB_URL'),
          freshStart: env.boolean('FRESH_START', false),
          connectionPoolSize: {
            // defaults used by knex
            min: 2,
            max: 10,
          },
        }
      : {
          freshStart: false,
          connection: {
            connectionString: env.string('DATABASE_URL'),
            ssl: { rejectUnauthorized: false },
          },
          connectionPoolSize: {
            // our heroku plan allows us for up to 400 open connections
            min: 20,
            max: 200,
          },
        },
    api: {
      port: env.integer('PORT', 3000),
    },
    health: {
      releasedAt: env.optionalString('HEROKU_RELEASE_CREATED_AT'),
      startedAt: new Date().toISOString(),
      commitSha: env.string('HEROKU_SLUG_COMMIT', getGitCommitHash()),
    },
    metricsAuth: settings.isLocal
      ? false
      : {
          user: env.string('METRICS_AUTH_USER'),
          pass: env.string('METRICS_AUTH_PASS'),
        },
    tvl: {
      enabled: env.boolean('TVL_ENABLED', true),
      errorOnUnsyncedTvl: env.boolean('ERROR_ON_UNSYNCED_TVL', false),
      coingeckoApiKey: env.optionalString('COINGECKO_API_KEY'),
      ethereum: getChainTvlConfig(env, 'ethereum', {
        minTimestamp: minBlockTimestamp,
      }),
      modules: getChainsWithTokens(tokenList, chains).map((x) =>
        getChainTvlConfig(env, x),
      ),
    },
  }
}
