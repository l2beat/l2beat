import { Env } from '@l2beat/backend-tools'
import { layer2s, layer3s, ScalingProjectTransactionApi } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'

import { ActivityTransactionConfig } from '../../modules/activity/ActivityTransactionConfig'

const DEFAULT_RPC_CALLS_PER_MINUTE = 60
const DEFAULT_RESYNC_LAST_DAYS = 7

export function getProjectsWithActivity() {
  const projects = [
    ...layer2s.filter((layer2) => !layer2.isArchived),
    ...layer3s,
  ]

  return [
    {
      id: ProjectId.ETHEREUM,
      transactionApi: {
        type: 'rpc',
        defaultUrl: 'https://eth-mainnet.alchemyapi.io/v2/demo',
        startBlock: 8929324,
      } as ScalingProjectTransactionApi,
    },
    ...projects.flatMap((x) =>
      x.config.transactionApi
        ? [{ id: x.id, transactionApi: x.config.transactionApi }]
        : [],
    ),
  ]
}

export function getChainActivityConfig(
  env: Env,
  project: { id: ProjectId; transactionApi: ScalingProjectTransactionApi },
): ActivityTransactionConfig {
  const ENV_NAME = project.id.toUpperCase().replace(/-/g, '_')

  if (project.transactionApi.type === 'rpc') {
    return {
      type: 'rpc',
      url: env.string(
        [`${ENV_NAME}_RPC_URL_FOR_ACTIVITY`, `${ENV_NAME}_RPC_URL`],
        project.transactionApi.defaultUrl,
      ),
      callsPerMinute: env.integer(
        [
          `${ENV_NAME}_RPC_CALLS_PER_MINUTE_FOR_ACTIVITY`,
          `${ENV_NAME}_RPC_CALLS_PER_MINUTE`,
        ],
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
        [`${ENV_NAME}_API_URL_FOR_ACTIVITY`, `${ENV_NAME}_API_URL`],
        project.transactionApi.defaultUrl,
      ),
      callsPerMinute: env.integer(
        [
          `${ENV_NAME}_API_CALLS_PER_MINUTE_FOR_ACTIVITY`,
          `${ENV_NAME}_API_CALLS_PER_MINUTE`,
        ],
        project.transactionApi.defaultCallsPerMinute ??
          DEFAULT_RPC_CALLS_PER_MINUTE,
      ),
    }
  }
}
