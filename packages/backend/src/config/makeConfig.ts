import { Env, LoggerOptions } from '@l2beat/backend-tools'
import { bridges, chains, layer2s, tokenList } from '@l2beat/config'
import { ConfigReader } from '@l2beat/discovery'
import { ChainId, UnixTime } from '@l2beat/shared-pure'

import { bridgeToProject, layer2ToProject } from '../model'
import { Config, DiscordConfig } from './Config'
import { FeatureFlags } from './FeatureFlags'
import {
  getChainActivityConfig,
  getProjectsWithActivity,
} from './features/activity'
import { getChainsWithTokens, getChainTvlConfig } from './features/tvl'
import { getChainDiscoveryConfig } from './features/updateMonitor'
import { getGitCommitHash } from './getGitCommitHash'

interface MakeConfigOptions {
  name: string
  isLocal?: boolean
  minTimestampOverride?: UnixTime
}

export function makeConfig(
  env: Env,
  { name, isLocal, minTimestampOverride }: MakeConfigOptions,
): Config {
  const flags = new FeatureFlags(
    env.string('FEATURES', isLocal ? '' : '*'),
  ).append('status')
  const minBlockTimestamp = minTimestampOverride ?? getEthereumMinTimestamp()

  return {
    name,
    projects: layer2s.map(layer2ToProject).concat(bridges.map(bridgeToProject)),
    tokens: tokenList,
    logger: {
      logLevel: env.string('LOG_LEVEL', 'INFO') as LoggerOptions['logLevel'],
      format: isLocal ? 'pretty' : 'json',
      utc: isLocal ? false : true,
      colors: isLocal ? true : false,
    },
    logThrottler: isLocal
      ? false
      : {
          callsUntilThrottle: 4,
          clearIntervalMs: 5000,
          throttleTimeMs: 20000,
        },
    clock: {
      minBlockTimestamp,
      safeTimeOffsetSeconds: 60 * 60,
    },
    database: isLocal
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
      port: env.integer('PORT', isLocal ? 3000 : undefined),
      cache: {
        tvl: flags.isEnabled('cache', 'tvl'),
      },
    },
    health: {
      releasedAt: env.optionalString('HEROKU_RELEASE_CREATED_AT'),
      startedAt: new Date().toISOString(),
      commitSha: env.string('HEROKU_SLUG_COMMIT', getGitCommitHash()),
    },
    metricsAuth: isLocal
      ? false
      : {
          user: env.string('METRICS_AUTH_USER'),
          pass: env.string('METRICS_AUTH_PASS'),
        },
    tvl: {
      enabled: flags.isEnabled('tvl'),
      errorOnUnsyncedTvl: env.boolean('ERROR_ON_UNSYNCED_TVL', false),
      coingeckoApiKey: env.optionalString('COINGECKO_API_KEY'),
      ethereum: getChainTvlConfig(flags, env, 'ethereum', {
        minTimestamp: minBlockTimestamp,
      }),
      modules: getChainsWithTokens(tokenList, chains).map((x) =>
        getChainTvlConfig(flags, env, x, {
          minTimestamp: minTimestampOverride,
        }),
      ),
    },
    liveness: flags.isEnabled('liveness') && {
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
    finality: flags.isEnabled('finality'),
    activity: flags.isEnabled('activity') && {
      starkexApiKey: env.string('STARKEX_API_KEY'),
      starkexCallsPerMinute: env.integer('STARKEX_CALLS_PER_MINUTE', 600),
      projectsExcludedFromAPI:
        env.optionalString('ACTIVITY_PROJECTS_EXCLUDED_FROM_API')?.split(' ') ??
        [],
      projects: getProjectsWithActivity()
        .filter((x) => flags.isEnabled('activity', x.id.toString()))
        .map((x) => ({ id: x.id, config: getChainActivityConfig(env, x) })),
    },
    statusEnabled: flags.isEnabled('status'),
    updateMonitor: flags.isEnabled('updateMonitor') && {
      runOnStart: isLocal
        ? env.boolean('UPDATE_MONITOR_RUN_ON_START', true)
        : undefined,
      discord: getDiscordConfig(env, isLocal),
      chains: new ConfigReader()
        .readAllChains()
        .filter((chain) => flags.isEnabled('updateMonitor', chain))
        .map((chain) => getChainDiscoveryConfig(env, chain)),
    },
    diffHistory: flags.isEnabled('diffHistory') && {
      chains: [getChainDiscoveryConfig(env, 'ethereum')],
    },
    chains: chains.map((x) => ({ name: x.name, chainId: ChainId(x.chainId) })),
    tvlCleanerEnabled: flags.isEnabled('tvlCleaner'),
    flags: flags.getResolved(),
  }
}

function getEthereumMinTimestamp() {
  const minBlockTimestamp = chains.find(
    (c) => c.name === 'ethereum',
  )?.minTimestampForTvl
  if (!minBlockTimestamp) {
    throw new Error('Missing minBlockTimestamp for ethereum')
  }
  return minBlockTimestamp
}

function getDiscordConfig(env: Env, isLocal?: boolean): DiscordConfig | false {
  const token = env.optionalString('DISCORD_TOKEN')
  const internalChannelId = env.optionalString('INTERNAL_DISCORD_CHANNEL_ID')
  const publicChannelId = env.optionalString('PUBLIC_DISCORD_CHANNEL_ID')

  const discordEnabled =
    !!token && !!internalChannelId && (isLocal || !!publicChannelId)

  return (
    discordEnabled && {
      token,
      publicChannelId,
      internalChannelId,
      callsPerMinute: 3000,
    }
  )
}
