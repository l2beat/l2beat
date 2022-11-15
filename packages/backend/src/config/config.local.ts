import { LogLevel } from '@l2beat/common'
import { bridges, layer2s, tokenList } from '@l2beat/config'
import { UnixTime } from '@l2beat/types'
import { config as dotenv } from 'dotenv'

import { CliParameters } from '../cli/getCliParameters'
import { bridgeToProject, layer2ToProject } from '../model'
import { Config } from './Config'
import { getEnv } from './getEnv'
import { getGitCommitHash } from './getGitCommitHash'

export function getLocalConfig(cli: CliParameters): Config {
  dotenv()
  if (cli.mode !== 'server' && cli.mode !== 'discover') {
    throw new Error(`Cannot get config for mode ${cli.mode}`)
  }
  return {
    name: 'Backend/Local',
    logger: {
      logLevel: getEnv.integer('LOG_LEVEL', LogLevel.INFO),
      format: 'pretty',
    },
    port: getEnv.integer('PORT', 3000),
    coingeckoApiKey: process.env.COINGECKO_API_KEY, // this is optional
    alchemyApiKey: getEnv('ALCHEMY_API_KEY'),
    etherscanApiKey: getEnv('ETHERSCAN_API_KEY'),
    databaseConnection:
      cli.mode === 'server' ? getEnv('LOCAL_DB_URL') : undefined,
    core: {
      // TODO: This should probably be configurable
      minBlockTimestamp: UnixTime.now().add(-7, 'days').toStartOf('hour'),
      safeBlockRefreshIntervalMs: 30 * 1000,
      safeTimeOffsetSeconds: 60 * 60,
    },
    tokens: tokenList.map((token) => ({
      ...token,
      priceStrategy: { type: 'market' },
    })),
    apiEnabled: cli.mode === 'server',
    projects: layer2s.map(layer2ToProject).concat(bridges.map(bridgeToProject)),
    syncEnabled: !getEnv.boolean('SYNC_DISABLED', false),
    freshStart: getEnv.boolean('FRESH_START', false),
    tvlReportSync:
      cli.mode === 'server' && getEnv.boolean('TVL_SYNC_ENABLED', true),
    activity: cli.mode === 'server' &&
      getEnv.boolean('TRANSACTION_COUNT_ENABLED', false) && {
        starkexApiKey: getEnv('STARKEX_API_KEY'),
        starkexApiDelayHours: 12,
        zkSyncWorkQueueWorkers: 1,
        aztecWorkQueueWorkers: 1,
        starkexWorkQueueWorkers: 100,
        starkexCallsPerMinute: 1000,
        loopringWorkQueueWorkers: 1,
        loopringCallsPerMinute: 10,
        rpc: {
          workQueueLimit: 10_000,
          workQueueWorkers: 1,
          projects: {
            ethereum: {
              callsPerMinute: 60 / 5,
              url: getEnv(
                'ACTIVITY_ETHEREUM_URL',
                'https://eth-mainnet.alchemyapi.io/v2/demo',
              ),
            },
            optimism: {
              callsPerMinute: 60 / 5,
              url: getEnv(
                'ACTIVITY_OPTIMISM_URL',
                'https://mainnet.optimism.io/',
              ),
            },
            arbitrum: {
              callsPerMinute: 60 / 5,
              url: getEnv(
                'ACTIVITY_ARBITRUM_URL',
                'https://arb1.arbitrum.io/rpc',
              ),
            },
          },
        },
      },
    activityV2: cli.mode === 'server' &&
      getEnv.boolean('ACTIVITY_V2_ENABLED', false) && {
        starkexApiKey: getEnv('STARKEX_API_KEY'),
        starkexApiDelayHours: 12,
        starkexCallsPerMinute: 1000,
        projects: {
          ethereum: {
            type: 'rpc',
            callsPerMinute: 60,
            url: getEnv(
              'ACTIVITY_ETHEREUM_URL',
              'https://eth-mainnet.alchemyapi.io/v2/demo',
            ),
          },
          optimism: {
            type: 'rpc',
            callsPerMinute: 60,
            url: getEnv(
              'ACTIVITY_OPTIMISM_URL',
              'https://mainnet.optimism.io/',
            ),
          },
          arbitrum: {
            type: 'rpc',
            callsPerMinute: 60,
            url: getEnv(
              'ACTIVITY_ARBITRUM_URL',
              'https://arb1.arbitrum.io/rpc',
            ),
          },
        },
      },
    health: {
      startedAt: new Date().toISOString(),
      commitSha: getGitCommitHash(),
    },
    discoveryBlockNumber: getEnv.optionalInteger('DISCOVERY_BLOCK_NUMBER'),
  }
}
