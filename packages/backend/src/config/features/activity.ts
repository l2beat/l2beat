import { Env } from '@l2beat/backend-tools'
import { type TransactionApiConfig, layer2s, layer3s } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'

import type { ActivityTransactionConfig } from '../../modules/activity/ActivityTransactionConfig'
import type { BlockscoutChainConfig, EtherscanChainConfig } from '../Config'

const DEFAULT_RPC_CALLS_PER_MINUTE = 60
const DEFAULT_RESYNC_LAST_DAYS = 7

export function getProjectsWithActivity(): {
  id: ProjectId
  transactionApi: TransactionApiConfig
  name?: string
  explorerApi?: {
    url: string
    type: 'etherscan' | 'blockscout'
  }
}[] {
  const projects = [
    ...layer2s.filter((layer2) => !layer2.isArchived),
    ...layer3s,
  ]

  return [
    {
      id: ProjectId.ETHEREUM,
      name: 'Ethereum',
      transactionApi: {
        type: 'rpc',
        defaultUrl: 'https://eth-mainnet.alchemyapi.io/v2/demo',
        startBlock: 8929324,
      },
      explorerApi: {
        type: 'etherscan',
        url: 'https://api.etherscan.io/api',
      },
    },
    ...projects.flatMap((x) =>
      x.config.transactionApi
        ? [
            {
              id: x.id,
              name: x.chainConfig?.name,
              transactionApi: x.config.transactionApi,
              explorerApi: x.chainConfig?.explorerApi,
            },
          ]
        : [],
    ),
  ]
}

export function getChainActivityBlockExplorerConfig(
  env: Env,
  project: {
    id: ProjectId
    name?: string
    transactionApi: TransactionApiConfig
    explorerApi?: {
      url: string
      type: 'etherscan' | 'blockscout'
    }
  },
): EtherscanChainConfig | BlockscoutChainConfig | undefined {
  if (!project.explorerApi || !project.name) {
    return undefined
  }
  return project.explorerApi?.type === 'etherscan'
    ? {
        type: project.explorerApi.type,
        apiKey: env.string([
          Env.key(project.name, 'ETHERSCAN_API_KEY_FOR_ACTIVITY'),
          Env.key(project.name, 'ETHERSCAN_API_KEY'),
        ]),
        url: project.explorerApi.url,
      }
    : {
        type: project.explorerApi.type,
        url: project.explorerApi.url,
      }
}

export function getChainActivityConfig(
  env: Env,
  project: { id: ProjectId; transactionApi: TransactionApiConfig },
): ActivityTransactionConfig {
  if (project.transactionApi.type === 'rpc') {
    return {
      type: 'rpc',
      url: env.string(
        [
          Env.key(project.id, 'RPC_URL_FOR_ACTIVITY'),
          Env.key(project.id, 'RPC_URL'),
        ],
        project.transactionApi.defaultUrl,
      ),
      callsPerMinute: env.integer(
        [
          Env.key(project.id, 'RPC_CALLS_PER_MINUTE_FOR_ACTIVITY'),
          Env.key(project.id, 'RPC_CALLS_PER_MINUTE'),
        ],
        project.transactionApi.defaultCallsPerMinute ??
          DEFAULT_RPC_CALLS_PER_MINUTE,
      ),
      adjustCount: project.transactionApi.adjustCount,
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
        [
          Env.key(project.id, 'API_URL_FOR_ACTIVITY'),
          Env.key(project.id, 'API_URL'),
        ],
        project.transactionApi.defaultUrl,
      ),
      callsPerMinute: env.integer(
        [
          Env.key(project.id, 'API_CALLS_PER_MINUTE_FOR_ACTIVITY'),
          Env.key(project.id, 'API_CALLS_PER_MINUTE'),
        ],
        project.transactionApi.defaultCallsPerMinute ??
          DEFAULT_RPC_CALLS_PER_MINUTE,
      ),
    }
  }
}
