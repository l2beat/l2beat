import { HttpClient, Logger } from '@l2beat/common'
import { ProjectId } from '@l2beat/types'
import { providers } from 'ethers'

import { Config } from '../config'
import { TransactionCountSyncConfig } from '../config/Config'
import { Clock } from '../core/Clock'
import { RpcTransactionUpdater } from '../core/transaction-count/RpcTransactionUpdater'
import { BlockTransactionCountRepository } from '../peripherals/database/BlockTransactionCountRepository'
import { EthereumClient } from '../peripherals/ethereum/EthereumClient'
import { StarkNetClient } from '../peripherals/starknet/StarkNetClient'
import { assert } from '../tools/assert'

export function createLayer2RpcTransactionUpdaters(
  config: Config,
  blockTransactionCountRepository: BlockTransactionCountRepository,
  clock: Clock,
  http: HttpClient,
  logger: Logger,
) {
  const activityConfig = config.transactionCountSync
  assert(activityConfig)
  const rpcUpdaters: RpcTransactionUpdater[] = []
  for (const { projectId, transactionApi } of config.projects) {
    if (transactionApi?.type === 'rpc') {
      const url =
        transactionApi.url ??
        activityConfig.rpc.projects[projectId.toString()]?.url
      assert(url)
      const callsPerMinute =
        transactionApi.callsPerMinute ??
        activityConfig.rpc.projects[projectId.toString()]?.callsPerMinute
      const rpcClient =
        projectId === ProjectId.STARKNET
          ? new StarkNetClient(url, http, { callsPerMinute })
          : new EthereumClient(
              new providers.JsonRpcProvider({
                url,
                timeout: 10_000,
              }),
              logger,
              callsPerMinute,
            )
      const transactionUpdater = new RpcTransactionUpdater(
        rpcClient,
        blockTransactionCountRepository,
        clock,
        logger,
        projectId,
        {
          assessCount: transactionApi.assessCount,
          workQueueSizeLimit: activityConfig.rpc.workQueueLimit,
          workQueueWorkers: activityConfig.rpc.workQueueWorkers,
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
) {
  const url = config.rpc.projects.ethereum?.url
  assert(url)
  const callsPerMinute = config.rpc.projects.ethereum?.callsPerMinute
  const provider = new providers.JsonRpcProvider({
    url,
    timeout: 10_000,
  })
  const client = new EthereumClient(provider, logger, callsPerMinute)
  const updater = new RpcTransactionUpdater(
    client,
    blockTransactionCountRepository,
    clock,
    logger,
    ProjectId.ETHEREUM,
    {
      startBlock: 8929324,
      workQueueSizeLimit: config.rpc.workQueueLimit,
      workQueueWorkers: config.rpc.workQueueWorkers,
    }, // TODO: make it cleaner, we already have a min timestamp in config
  )
  return updater
}
