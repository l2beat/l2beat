import { Layer2TransactionApi } from '@l2beat/config'
import { providers } from 'ethers'

import { Config } from './config'
import { EthereumClient } from './peripherals/ethereum/EthereumClient'

export function createL2Clients(config: Config) {
  return config.projects
    .map((project) => {
      if (project.transactionApi?.type === 'rpc') {
        return {
          projectId: project.projectId,
          client: new EthereumClient(
            createL2Provider(project.transactionApi, config.alchemyApiKey),
            project.transactionApi.callsPerMinute,
          ),
        }
      }
    })
    .filter(noUndefined)
}

function createL2Provider(rpc: Layer2TransactionApi, alchemyApiKey: string) {
  switch (rpc.provider) {
    case 'alchemy':
      return new providers.AlchemyProvider(rpc.networkName, alchemyApiKey)

    case 'jsonRpc':
      return new providers.JsonRpcProvider(rpc.url)

    default:
      throw new Error('Unknown provider')
  }
}

function noUndefined<T>(x: T | undefined): x is T {
  return x !== undefined
}
