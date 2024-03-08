import { assert, Env, LoggerOptions } from '@l2beat/backend-tools'
import { bridges, chains, layer2s, tokenList } from '@l2beat/config'
import { ConfigReader } from '@l2beat/discovery'
import { ChainId, Token, TokenQuery, UnixTime } from '@l2beat/shared-pure'

import { bridgeToProject, layer2ToProject, Project } from '../model/Project'
import { ChainConverter } from '../tools/ChainConverter'
import { Config, DiscordConfig } from './Config'
import { FeatureFlags } from './FeatureFlags'
import {
  getChainActivityConfig,
  getProjectsWithActivity,
} from './features/activity'
import { getFinalityConfigurations } from './features/finality'
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

  const projects = layer2s
    .map(layer2ToProject)
    .concat(bridges.map(bridgeToProject))

  return {
    name,
    projects: projects,
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
        liveness: flags.isEnabled('cache', 'liveness'),
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
    finality: flags.isEnabled('finality') && {
      ethereumProviderUrl: env.string('FINALITY_ETHEREUM_PROVIDER_URL'),
      ethereumProviderCallsPerMinute: env.integer(
        'FINALITY_ETHEREUM_PROVIDER_CALLS_PER_MINUTE',
        600,
      ),
      configurations: getFinalityConfigurations(flags, env),
    },
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
    diffHistory: flags.isEnabled('diffHistory') && {
      chains: [getChainDiscoveryConfig(env, 'ethereum')],
    },
    chains: chains.map((x) => ({ name: x.name, chainId: ChainId(x.chainId) })),
    tvlCleanerEnabled: flags.isEnabled('tvlCleaner'),
    flags: flags.getResolved(),
    queries: getQueries(projects, tokenList),
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
function getQueries(projects: Project[], tokenList: Token[]): TokenQuery[] {
  const chainConverter = new ChainConverter(
    chains.map((x) => ({ name: x.name, chainId: ChainId(x.chainId) })),
  )
  const notEthereumTokens: TokenQuery[] = []

  for (const token of tokenList) {
    if (token.chainId !== ChainId.ETHEREUM) {
      switch (token.formula) {
        case 'totalSupply':
          assert(token.address, 'Token address is required for total supply')
          notEthereumTokens.push({
            address: token.address ?? 'native',
            chain: chainConverter.toName(token.chainId),
            sinceTimestamp: token.sinceTimestamp,
            price: { type: 'coingecko', coingeckoId: token.coingeckoId },
            amount: { type: 'totalSupply', address: token.address },
          })
          break
        case 'circulatingSupply':
          notEthereumTokens.push({
            address: token.address ?? 'native',
            chain: chainConverter.toName(token.chainId),
            sinceTimestamp: token.sinceTimestamp,
            price: { type: 'coingecko', coingeckoId: token.coingeckoId },
            amount: {
              type: 'circulatingSupply',
              coingeckoId: token.coingeckoId,
            },
          })
          break
        case 'locked':
          throw new Error('Locked tokens are derived from projects list')
      }
    }
  }

  for (const project of projects) {
    for (const escrow of project.escrows) {
      for (const token of escrow.tokens) {
        notEthereumTokens.push({
          address: token.address ?? 'native',
          chain: chainConverter.toName(token.chainId),
          sinceTimestamp: token.sinceTimestamp,
          price: { type: 'coingecko', coingeckoId: token.coingeckoId },
          amount: { type: 'escrow', escrowAddress: escrow.address },
        })
      }
    }
  }

  return notEthereumTokens
}
