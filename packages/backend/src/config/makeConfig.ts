import {
  ElasticSearchTransport,
  ElasticSearchTransportOptions,
  Env,
  LogFormatterEcs,
  LogFormatterJson,
  LogFormatterPretty,
  LoggerOptions,
  LoggerTransportOptions,
} from '@l2beat/backend-tools'
import { bridges, chains, layer2s, tokenList } from '@l2beat/config'
import { ConfigReader } from '@l2beat/discovery'
import { ChainId, UnixTime } from '@l2beat/shared-pure'

import { bridgeToProject, layer2ToProject } from '../model/Project'
import { Config, DiscordConfig } from './Config'
import { FeatureFlags } from './FeatureFlags'
import {
  getChainActivityConfig,
  getProjectsWithActivity,
} from './features/activity'
import { getFinalityConfigurations } from './features/finality'
import { getChainsWithTokens, getChainTvlConfig } from './features/tvl'
import { getTvl2Config } from './features/tvl2'
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
  const tvl2Config = getTvl2Config(flags, env, minTimestampOverride)

  const isReadonly = env.boolean(
    'READONLY',
    // if we connect locally to production db, we want to be readonly!
    isLocal && !env.string('LOCAL_DB_URL').includes('localhost'),
  )

  const loggerTransports: LoggerTransportOptions[] = [
    {
      transport: console,
      formatter: isLocal ? new LogFormatterPretty() : new LogFormatterJson(),
    },
  ]

  // Elastic Search logging
  const esEnabled = env.optionalBoolean('ES_ENABLED') ?? false

  if (esEnabled) {
    console.log('Elastic Search logging enabled')
    const options: ElasticSearchTransportOptions = {
      node: env.string('ES_NODE'),
      apiKey: env.string('ES_API_KEY'),
      indexPrefix: env.string('ES_INDEX_PREFIX'),
      flushInterval: env.optionalInteger('ES_FLUSH_INTERVAL'),
    }

    loggerTransports.push({
      transport: new ElasticSearchTransport(options),
      formatter: new LogFormatterEcs(),
    })
  }

  return {
    name,
    isReadonly,
    projects: layer2s.map(layer2ToProject).concat(bridges.map(bridgeToProject)),
    tokens: tokenList,
    logger: {
      logLevel: env.string('LOG_LEVEL', 'INFO') as LoggerOptions['logLevel'],
      utc: isLocal ? false : true,
      transports: loggerTransports,
    },
    logThrottler: isLocal
      ? false
      : {
          callsUntilThrottle: 4,
          clearIntervalMs: 5000,
          throttleTimeMs: 20000,
        },
    clock: {
      minBlockTimestamp: minTimestampOverride ?? getEthereumMinTimestamp(),
      safeTimeOffsetSeconds: 60 * 60,
    },
    database: isLocal
      ? {
          connection: env.string('LOCAL_DB_URL').includes('localhost')
            ? env.string('LOCAL_DB_URL')
            : {
                connectionString: env.string('LOCAL_DB_URL'),
                ssl: { rejectUnauthorized: false },
              },
          freshStart: env.boolean('FRESH_START', false),
          enableQueryLogging: env.boolean('ENABLE_QUERY_LOGGING', false),
          connectionPoolSize: {
            // defaults used by knex
            min: 2,
            max: 10,
          },
          isReadonly,
        }
      : {
          freshStart: false,
          enableQueryLogging: env.boolean('ENABLE_QUERY_LOGGING', false),
          connection: {
            connectionString: env.string('DATABASE_URL'),
            ssl: { rejectUnauthorized: false },
          },
          connectionPoolSize: {
            // our heroku plan allows us for up to 400 open connections
            min: 20,
            max: 200,
          },
          isReadonly,
        },
    api: {
      port: env.integer('PORT', isLocal ? 3000 : undefined),
      cache: {
        tvl: flags.isEnabled('cache', 'tvl'),
        liveness: flags.isEnabled('cache', 'liveness'),
        l2costs: flags.isEnabled('cache', 'l2costs'),
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
      coingeckoApiKey: env.optionalString([
        'COINGECKO_API_KEY_FOR_TVL',
        'COINGECKO_API_KEY',
      ]),
      ethereum: getChainTvlConfig(
        flags.isEnabled('tvl', 'ethereum'),
        env,
        'ethereum',
        { minTimestamp: minTimestampOverride },
      ),
      modules: getChainsWithTokens(tokenList, chains).map((chain) =>
        getChainTvlConfig(flags.isEnabled('tvl', chain), env, chain, {
          minTimestamp: minTimestampOverride,
        }),
      ),
    },
    tvl2: flags.isEnabled('tvl2') && tvl2Config,
    trackedTxsConfig: flags.isEnabled('tracked-txs') && {
      bigQuery: {
        clientEmail: env.string('BIGQUERY_CLIENT_EMAIL'),
        privateKey: env.string('BIGQUERY_PRIVATE_KEY').replace(/\\n/g, '\n'),
        projectId: env.string('BIGQUERY_PROJECT_ID'),
      },
      // TODO: figure out how to set it for local development
      minTimestamp: UnixTime.fromDate(new Date('2023-05-01T00:00:00Z')),
      uses: {
        liveness: flags.isEnabled('tracked-txs', 'liveness'),
        l2costs: flags.isEnabled('tracked-txs', 'l2costs') && {
          aggregatorEnabled: flags.isEnabled(
            'tracked-txs',
            'l2costs',
            'aggregator',
          ),
          ethereumProviderUrl: env.string([
            'ETHEREUM_RPC_URL_FOR_L2COSTS',
            'ETHEREUM_RPC_URL',
          ]),
          ethereumProviderCallsPerMinute: env.integer(
            [
              'ETHEREUM_RPC_CALLS_PER_MINUTE_FOR_L2COSTS',
              'ETHEREUM_RPC_CALLS_PER_MINUTE',
            ],
            600,
          ),
        },
      },
    },
    finality: flags.isEnabled('finality') && {
      ethereumProviderUrl: env.string([
        'ETHEREUM_RPC_URL_FOR_FINALITY',
        'ETHEREUM_RPC_URL',
      ]),
      ethereumProviderCallsPerMinute: env.integer(
        [
          'ETHEREUM_RPC_CALLS_PER_MINUTE_FOR_FINALITY',
          'ETHEREUM_RPC_CALLS_PER_MINUTE',
        ],
        600,
      ),
      beaconApiUrl: env.string([
        'ETHEREUM_BEACON_API_URL_FOR_FINALITY',
        'ETHEREUM_BEACON_API_URL',
      ]),
      beaconApiCPM: env.integer(
        [
          'ETHEREUM_BEACON_API_CALLS_PER_MINUTE_FOR_FINALITY',
          'ETHEREUM_BEACON_API_CALLS_PER_MINUTE',
        ],
        600,
      ),
      beaconApiTimeout: env.integer(
        [
          'ETHEREUM_BEACON_API_TIMEOUT_FOR_FINALITY',
          'ETHEREUM_BEACON_API_TIMEOUT',
        ],
        10000,
      ),
      configurations: getFinalityConfigurations(flags, env),
    },
    activity: flags.isEnabled('activity') && {
      starkexApiKey: env.string([
        'STARKEX_API_KEY_FOR_ACTIVITY',
        'STARKEX_API_KEY',
      ]),
      starkexCallsPerMinute: env.integer(
        [
          'STARKEX_API_CALLS_PER_MINUTE_FOR_ACTIVITY',
          'STARKEX_API_CALLS_PER_MINUTE',
        ],
        600,
      ),
      projectsExcludedFromAPI:
        env.optionalString('ACTIVITY_PROJECTS_EXCLUDED_FROM_API')?.split(' ') ??
        [],
      projects: getProjectsWithActivity()
        .filter((x) => flags.isEnabled('activity', x.id.toString()))
        .map((x) => ({ id: x.id, config: getChainActivityConfig(env, x) })),
    },
    lzOAppsEnabled: flags.isEnabled('lzOApps'),
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
    implementationChangeReporterEnabled: flags.isEnabled(
      'implementationChangeReporter',
    ),
    chains: chains.map((x) => ({ name: x.name, chainId: ChainId(x.chainId) })),
    tvlCleanerEnabled: flags.isEnabled('tvlCleaner'),

    // Must be last
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
