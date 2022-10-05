import { Logger } from '@l2beat/common'
import { RpcTransactionApi } from '@l2beat/config'
import { ProjectId } from '@l2beat/types'
import { providers } from 'ethers'

import { Config } from '../config'
import { TransactionCountSyncConfig } from '../config/Config'
import { Clock } from '../core/Clock'
import { RpcTransactionUpdater } from '../core/transaction-count/RpcTransactionUpdater'
import { BlockTransactionCountRepository } from '../peripherals/database/BlockTransactionCountRepository'
import { EthereumClient } from '../peripherals/ethereum/EthereumClient'
import { assert } from '../tools/assert'

export function createLayer2RpcTransactionUpdaters(
  config: Config,
  blockTransactionCountRepository: BlockTransactionCountRepository,
  clock: Clock,
  logger: Logger,
) {
  assert(config.transactionCountSync)
  const rpcUpdaters: RpcTransactionUpdater[] = []

  for (const project of config.projects) {
    if (project.transactionApi?.type === 'rpc') {
      const l2Provider = createL2Provider(
        config.transactionCountSync,
        project.transactionApi,
        project.projectId,
      )

      const ethereumClient = new EthereumClient(
        l2Provider,
        logger,
        project.transactionApi.callsPerMinute,
      )

      const transactionUpdater = new RpcTransactionUpdater(
        ethereumClient,
        blockTransactionCountRepository,
        clock,
        logger,
        project.projectId,
        {
          assessCount: project.transactionApi.assessCount,
          workQueueSizeLimit: config.transactionCountSync.rpcWorkQueueLimit,
          workQueueWorkers: config.transactionCountSync.rpcWorkQueueWorkers,
        },
      )

      rpcUpdaters.push(transactionUpdater)
    }
  }

  return rpcUpdaters
}

export function createEthereumTransactionUpdater(
  config: TransactionCountSyncConfig,
  blockTransactionCountRepository: BlockTransactionCountRepository,
  clock: Clock,
  logger: Logger,
  apiKey: string,
) {
  const provider = new providers.AlchemyProvider('mainnet', apiKey)
  const client = new EthereumClient(provider, logger)
  const updater = new RpcTransactionUpdater(
    client,
    blockTransactionCountRepository,
    clock,
    logger,
    ProjectId.ETHEREUM,
    {
      startBlock: 8929324,
      workQueueSizeLimit: config.rpcWorkQueueLimit,
      workQueueWorkers: config.rpcWorkQueueWorkers,
    }, // TODO: make it cleaner, we already have a min timestamp in config
  )
  return updater
}

function createL2Provider(
  config: TransactionCountSyncConfig,
  rpc: RpcTransactionApi,
  projectId: ProjectId,
) {
  if (rpc.provider === 'jsonRpc') {
    return new providers.JsonRpcProvider({
      url: rpc.url,
      timeout: 10000,
    })
  }

  let apiKey = ''
  if (projectId === ProjectId('arbitrum')) {
    apiKey = config.arbitrumAlchemyApiKey
  }
  if (projectId === ProjectId('optimism')) {
    apiKey = config.optimismAlchemyApiKey
  }
  if (!apiKey) {
    throw new Error('Please provide alchemy api key')
  }

  return new providers.AlchemyProvider(rpc.networkName, apiKey)
}
