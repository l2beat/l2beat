import { Env } from '@l2beat/backend-tools'
import type {
  ChainConfig,
  ProjectService,
  TransactionApiConfig,
} from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import type { ActivityTransactionConfig } from '../../modules/activity/ActivityTransactionConfig'
import type {
  ActivityConfig,
  BlockscoutChainConfig,
  EtherscanChainConfig,
} from '../Config'
import type { FeatureFlags } from '../FeatureFlags'

const DEFAULT_RPC_CALLS_PER_MINUTE = 60
const DEFAULT_RESYNC_LAST_DAYS = 7

export async function getActivityConfig(
  ps: ProjectService,
  env: Env,
  flags: FeatureFlags,
): Promise<ActivityConfig> {
  const projects = await ps.getProjects({
    select: ['transactionApiConfig'],
    optional: ['chainConfig'],
    whereNot: ['isArchived'],
  })

  return {
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
    projects: projects
      .filter((x) => flags.isEnabled('activity', x.id.toString()))
      .map((x) => ({
        id: x.id,
        config: getActivityTransactionConfig(env, x.id, x.transactionApiConfig),
        blockExplorerConfig: getActivityExplorerConfig(env, x.chainConfig),
      })),
  }
}

function getActivityTransactionConfig(
  env: Env,
  projectId: ProjectId,
  transactionApi: TransactionApiConfig,
): ActivityTransactionConfig {
  if (transactionApi.type === 'rpc') {
    return {
      type: 'rpc',
      url: env.string(
        [
          Env.key(projectId, 'RPC_URL_FOR_ACTIVITY'),
          Env.key(projectId, 'RPC_URL'),
        ],
        transactionApi.defaultUrl,
      ),
      callsPerMinute: env.integer(
        [
          Env.key(projectId, 'RPC_CALLS_PER_MINUTE_FOR_ACTIVITY'),
          Env.key(projectId, 'RPC_CALLS_PER_MINUTE'),
        ],
        transactionApi.defaultCallsPerMinute ?? DEFAULT_RPC_CALLS_PER_MINUTE,
      ),
      adjustCount: transactionApi.adjustCount,
      startBlock: transactionApi.startBlock,
    }
  } else if (transactionApi.type === 'starkex') {
    return {
      type: 'starkex',
      product: transactionApi.product,
      sinceTimestamp: transactionApi.sinceTimestamp,
      resyncLastDays: transactionApi.resyncLastDays ?? DEFAULT_RESYNC_LAST_DAYS,
    }
  } else {
    return {
      type: transactionApi.type,
      url: env.string(
        [
          Env.key(projectId, 'API_URL_FOR_ACTIVITY'),
          Env.key(projectId, 'API_URL'),
        ],
        transactionApi.defaultUrl,
      ),
      callsPerMinute: env.integer(
        [
          Env.key(projectId, 'API_CALLS_PER_MINUTE_FOR_ACTIVITY'),
          Env.key(projectId, 'API_CALLS_PER_MINUTE'),
        ],
        transactionApi.defaultCallsPerMinute ?? DEFAULT_RPC_CALLS_PER_MINUTE,
      ),
    }
  }
}

function getActivityExplorerConfig(
  env: Env,
  chainConfig: ChainConfig | undefined,
): EtherscanChainConfig | BlockscoutChainConfig | undefined {
  if (!chainConfig?.explorerApi) {
    return undefined
  }
  return chainConfig.explorerApi.type === 'etherscan'
    ? {
        type: chainConfig.explorerApi.type,
        apiKey: env.string([
          Env.key(chainConfig.name, 'ETHERSCAN_API_KEY_FOR_ACTIVITY'),
          Env.key(chainConfig.name, 'ETHERSCAN_API_KEY'),
        ]),
        url: chainConfig.explorerApi.url,
      }
    : {
        type: chainConfig.explorerApi.type,
        url: chainConfig.explorerApi.url,
      }
}
