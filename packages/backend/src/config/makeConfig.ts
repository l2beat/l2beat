import { join } from 'path'
import type { Env } from '@l2beat/backend-tools'
import { type ChainConfig, ProjectService } from '@l2beat/config'
import { ConfigReader } from '@l2beat/discovery'
import type { UnixTime } from '@l2beat/shared-pure'
import type { Config, DiscordConfig } from './Config'
import { FeatureFlags } from './FeatureFlags'
import { getChainConfig } from './chain/getChainConfig'
import { getActivityConfig } from './features/activity'
import { getDaTrackingConfig } from './features/da'
import { getDaBeatConfig } from './features/dabeat'
import { getFinalityConfig } from './features/finality'
import { getTrackedTxsConfig } from './features/trackedTxs'
import { getTvlConfig } from './features/tvl'
import { getChainDiscoveryConfig } from './features/updateMonitor'
import { getVerifiersConfig } from './features/verifiers'
import { getGitCommitHash } from './getGitCommitHash'

interface MakeConfigOptions {
  name: string
  isLocal?: boolean
  minTimestampOverride?: UnixTime
}

export async function makeConfig(
  env: Env,
  { name, isLocal, minTimestampOverride }: MakeConfigOptions,
): Promise<Config> {
  const ps = new ProjectService()

  const flags = new FeatureFlags(
    env.string('FEATURES', isLocal ? '' : '*'),
  ).append('status')

  const chains = (await ps.getProjects({ select: ['chainConfig'] })).map(
    (p) => p.chainConfig,
  )
  const isReadonly = env.boolean(
    'READONLY',
    // if we connect locally to production db, we want to be readonly!
    isLocal && !env.string('LOCAL_DB_URL').includes('localhost'),
  )

  return {
    name,
    isReadonly,
    clock: {
      minBlockTimestamp:
        minTimestampOverride ?? getEthereumMinTimestamp(chains),
      safeTimeOffsetSeconds: 60 * 60,
      hourlyCutoffDays: 7,
      sixHourlyCutoffDays: 90,
    },
    database: isLocal
      ? {
          connection: {
            connectionString: env.string('LOCAL_DB_URL'),
            application_name: 'BE-LOCAL',
            ssl: !env.string('LOCAL_DB_URL').includes('localhost')
              ? { rejectUnauthorized: false }
              : undefined,
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
            application_name: 'BE-PROD',
            ssl: { rejectUnauthorized: false },
          },
          connectionPoolSize: {
            // our heroku plan allows us for up to 400 open connections
            min: 20,
            max: 200,
          },
          isReadonly,
        },
    coingeckoApiKey: env.string('COINGECKO_API_KEY'),
    api: {
      port: env.integer('PORT', isLocal ? 3000 : undefined),
      cache: {
        tvl: flags.isEnabled('cache', 'tvl'),
        liveness: flags.isEnabled('cache', 'liveness'),
        verifiers: flags.isEnabled('cache', 'verifiers'),
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
    tvl:
      flags.isEnabled('tvl') &&
      (await getTvlConfig(ps, flags, env, chains, minTimestampOverride)),
    trackedTxsConfig:
      flags.isEnabled('tracked-txs') &&
      (await getTrackedTxsConfig(ps, env, flags)),
    finality:
      flags.isEnabled('finality') && (await getFinalityConfig(ps, env, flags)),
    activity:
      flags.isEnabled('activity') && (await getActivityConfig(ps, env, flags)),
    verifiers: flags.isEnabled('verifiers') && (await getVerifiersConfig(ps)),
    lzOAppsEnabled: flags.isEnabled('lzOApps'),
    statusEnabled: flags.isEnabled('status'),
    updateMonitor: flags.isEnabled('updateMonitor') && {
      runOnStart: isLocal
        ? env.boolean('UPDATE_MONITOR_RUN_ON_START', true)
        : undefined,
      discord: getDiscordConfig(env, isLocal),
      chains: new ConfigReader(join(process.cwd(), '../config'))
        .readAllChains()
        .filter((chain) => flags.isEnabled('updateMonitor', chain))
        .map((chain) => getChainDiscoveryConfig(env, chain, chains)),
      cacheEnabled: env.optionalBoolean(['DISCOVERY_CACHE_ENABLED']),
      cacheUri: env.string(['DISCOVERY_CACHE_URI'], 'postgres'),
      updateMessagesRetentionPeriodDays: env.integer(
        ['UPDATE_MESSAGES_RETENTION_PERIOD_DAYS'],
        30,
      ),
    },
    implementationChangeReporterEnabled: flags.isEnabled(
      'implementationChangeReporter',
    ),
    flatSourceModuleEnabled: flags.isEnabled('flatSourcesModule'),
    chains: chains.map((x) => ({ name: x.name, chainId: x.chainId })),
    daBeat: flags.isEnabled('da-beat') && (await getDaBeatConfig(ps, env)),
    chainConfig: await getChainConfig(ps, env),
    beaconApi: {
      url: env.optionalString([
        'ETHEREUM_BEACON_API_URL_FOR_FINALITY',
        'ETHEREUM_BEACON_API_URL',
      ]),
      callsPerMinute: env.integer(
        [
          'ETHEREUM_BEACON_API_CALLS_PER_MINUTE_FOR_FINALITY',
          'ETHEREUM_BEACON_API_CALLS_PER_MINUTE',
        ],
        600,
      ),
      timeout: env.integer(
        [
          'ETHEREUM_BEACON_API_TIMEOUT_FOR_FINALITY',
          'ETHEREUM_BEACON_API_TIMEOUT',
        ],
        10000,
      ),
    },
    da: flags.isEnabled('da') && (await getDaTrackingConfig(ps, env)),
    // Must be last
    flags: flags.getResolved(),
  }
}

function getEthereumMinTimestamp(chains: ChainConfig[]) {
  const minBlockTimestamp = chains.find(
    (c) => c.name === 'ethereum',
  )?.sinceTimestamp
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
