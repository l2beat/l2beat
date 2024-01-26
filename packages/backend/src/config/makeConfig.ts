import { Env, LoggerOptions } from '@l2beat/backend-tools'
import { bridges, chains, layer2s, tokenList } from '@l2beat/config'
import { ChainId, UnixTime } from '@l2beat/shared-pure'

import { bridgeToProject, layer2ToProject } from '../model'
import { Config, DiscordConfig } from './Config'
import { getChainDiscoveryConfig } from './getChainDiscoveryConfig'
import { getChainsWithTokens } from './getChainsWithTokens'
import { getChainTvlConfig } from './getChainTvlConfig'
import { getGitCommitHash } from './getGitCommitHash'

interface Settings {
  name: string
  isLocal?: boolean
  minTimestampOverride?: UnixTime
}

export function makeConfig(
  env: Env,
  settings: Settings,
): Omit<Config, 'activity'> {
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
    liveness: env.boolean('LIVENESS_ENABLED', false) && {
      bigQuery: {
        clientEmail: env.string('LIVENESS_CLIENT_EMAIL'),
        privateKey: env.string('LIVENESS_PRIVATE_KEY').replace(/\\n/g, '\n'),
        projectId: env.string('LIVENESS_PROJECT_ID'),
        queryLimitGb: env.integer('LIVENESS_BIGQUERY_LIMIT_GB', 15),
        queryWarningLimitGb: env.integer(
          'LIVENESS_BIGQUERY_WARNING_LIMIT_GB',
          8,
        ),
      },
      // TODO: figure out how to set it for local development
      minTimestamp: UnixTime.fromDate(new Date('2023-05-01T00:00:00Z')),
    },
    finality: env.boolean('FINALITY_ENABLED', false),
    statusEnabled: env.boolean('STATUS_ENABLED', true),
    updateMonitor: env.boolean('WATCHMODE_ENABLED', false) && {
      runOnStart: settings.isLocal
        ? env.boolean('UPDATE_MONITOR_RUN_ON_START', true)
        : undefined,
      discord: getDiscordConfig(env, settings),
      chains: [
        getChainDiscoveryConfig(env, 'ethereum'),
        getChainDiscoveryConfig(env, 'arbitrum'),
        getChainDiscoveryConfig(env, 'bsc'),
        getChainDiscoveryConfig(env, 'celo'),
        getChainDiscoveryConfig(env, 'gnosis'),
        getChainDiscoveryConfig(env, 'linea'),
        getChainDiscoveryConfig(env, 'optimism'),
        getChainDiscoveryConfig(env, 'polygonpos'),
        getChainDiscoveryConfig(env, 'polygonzkevm'),
      ],
    },
    diffHistory: env.boolean('DIFF_HISTORY_ENABLED', false) && {
      chains: [getChainDiscoveryConfig(env, 'ethereum')],
    },
    chains: chains.map((x) => ({ name: x.name, chainId: ChainId(x.chainId) })),
  }
}

function getDiscordConfig(env: Env, settings: Settings): DiscordConfig | false {
  const discordToken = env.optionalString('DISCORD_TOKEN')
  const internalDiscordChannelId = env.optionalString(
    'INTERNAL_DISCORD_CHANNEL_ID',
  )
  const publicDiscordChannelId = env.optionalString('PUBLIC_DISCORD_CHANNEL_ID')

  const discordEnabled =
    !!discordToken &&
    !!internalDiscordChannelId &&
    (settings.isLocal || !!publicDiscordChannelId)

  return (
    discordEnabled && {
      token: discordToken,
      publicChannelId: publicDiscordChannelId,
      internalChannelId: internalDiscordChannelId,
      callsPerMinute: 3000,
    }
  )
}
