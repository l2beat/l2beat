import { Logger } from '@l2beat/common'
import { RpcTransactionApi } from '@l2beat/config'
import { providers } from 'ethers'

import { Config } from '../config'
import { Clock } from '../core/Clock'
import { RpcTransactionUpdater } from '../core/transaction-count/RpcTransactionUpdater'
import { RpcTransactionCountRepository } from '../peripherals/database/RpcTransactionCountRepository'
import { EthereumClient } from '../peripherals/ethereum/EthereumClient'

export function createRpcTransactionUpdaters(
  config: Config,
  rpcTransactionCountRepository: RpcTransactionCountRepository,
  clock: Clock,
  logger: Logger,
) {
  const rpcUpdaters: RpcTransactionUpdater[] = []
  for (const project of config.projects) {
    if (project.transactionApi?.type === 'rpc') {
      const l2Provider = createL2Provider(
        project.transactionApi,
        config.alchemyApiKey,
      )

      const ethereumClient = new EthereumClient(
        l2Provider,
        logger,
        project.transactionApi.callsPerMinute,
      )

      const transactionUpdater = new RpcTransactionUpdater(
        ethereumClient,
        rpcTransactionCountRepository,
        clock,
        logger,
        project.projectId,
      )

      rpcUpdaters.push(transactionUpdater)
    }
  }

  return rpcUpdaters
}

function createL2Provider(rpc: RpcTransactionApi, alchemyApiKey: string) {
  switch (rpc.provider) {
    case 'alchemy':
      return new providers.AlchemyProvider(rpc.networkName, alchemyApiKey)

    case 'jsonRpc':
      return new providers.JsonRpcProvider(rpc.url)

    default:
      throw new Error('Unknown provider')
  }
}
