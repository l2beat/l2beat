import { Layer2TransactionApi, layer2s } from '@l2beat/config'
import { ActivityTransactionConfig } from '../../core/activity/ActivityTransactionConfig'
import { ProjectId } from '@l2beat/shared-pure'
import { Env } from '@l2beat/backend-tools'

const DEFAULT_RPC_CALLS_PER_MINUTE = 60
const DEFAULT_RESYNC_LAST_DAYS = 7

export function getProjectsWithActivity() {
  return [
    {
      id: ProjectId.ETHEREUM,
      transactionApi: {
        type: 'rpc',
        defaultUrl: 'https://eth-mainnet.alchemyapi.io/v2/demo',
      } as Layer2TransactionApi,
    },
    ...layer2s.flatMap((x) =>
      x.config.transactionApi
        ? [{ id: x.id, transactionApi: x.config.transactionApi }]
        : [],
    ),
  ]
}

export function getChainActivityConfig(
  env: Env,
  project: { id: ProjectId; transactionApi: Layer2TransactionApi },
): ActivityTransactionConfig {
  const ENV_NAME = project.id.toUpperCase().replace(/-/g, '_')

  if (project.transactionApi.type === 'rpc') {
    return {
      type: 'rpc',
      url: env.string(
        `ACTIVITY_${ENV_NAME}_URL`,
        project.transactionApi.defaultUrl,
      ),
      callsPerMinute: env.integer(
        `ACTIVITY_${ENV_NAME}_CALLS`,
        project.transactionApi.defaultCallsPerMinute ??
          DEFAULT_RPC_CALLS_PER_MINUTE,
      ),
      assessCount: project.transactionApi.assessCount,
      startBlock: project.transactionApi.startBlock,
    }
  } else if (project.transactionApi.type === 'starkex') {
    return {
      type: 'starkex',
      product: project.transactionApi.product,
      sinceTimestamp: project.transactionApi.sinceTimestamp,
      resyncLastDays:
        project.transactionApi.resyncLastDays ?? DEFAULT_RESYNC_LAST_DAYS,
    }
  } else {
    return {
      type: project.transactionApi.type,
      url: env.string(
        `ACTIVITY_${ENV_NAME}_URL`,
        project.transactionApi.defaultUrl,
      ),
      callsPerMinute: env.integer(
        `ACTIVITY_${ENV_NAME}_CALLS`,
        project.transactionApi.defaultCallsPerMinute ??
          DEFAULT_RPC_CALLS_PER_MINUTE,
      ),
    }
  }
}
