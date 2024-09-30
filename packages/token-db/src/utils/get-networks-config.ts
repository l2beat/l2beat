import { Logger } from '@l2beat/backend-tools'
import { Database } from '@l2beat/database'
import { notUndefined } from '@l2beat/shared-pure'
import { http, PublicClient, createPublicClient } from 'viem'
import * as viemChains from 'viem/chains'
import { DatabaseCache } from './cache/database-cache.js'
import {
  NetworkExplorerClient,
  instantiateExplorer,
} from './explorers/index.js'

type Dependencies = {
  logger: Logger
  db: Database
}

export type NetworkConfig = {
  networkId: string
  name: string
  chainId: number
  publicClient: PublicClient
  explorerClient?: NetworkExplorerClient
}

export async function getNetworksConfig({
  db,
  logger,
}: Dependencies): Promise<NetworkConfig[]> {
  logger = logger.for('NetworksConfig')

  const cache = new DatabaseCache(db)

  logger.info(`Getting networks config...`)

  const networks = await db.network.getAllWithConfigs()

  const chains = Object.values(viemChains) as viemChains.Chain[]

  const result = networks
    .filter((network) => network.rpc?.url)
    .map((network) => {
      const chain = chains.find((c) => c.id === network.chainId)

      if (!chain) {
        return
      }

      const explorerClient = network.explorers[0]
        ? instantiateExplorer(network.explorers[0], {
            cache: cache,
            chainId: network.chainId,
          })
        : undefined

      return {
        networkId: network.id,
        name: network.name,
        chainId: network.chainId,
        publicClient: createPublicClient({
          chain,
          transport: http(network.rpc?.url, {
            retryCount: 15,
            retryDelay: 1000,
          }),
          batch: {
            multicall: true,
          },
        }),
        explorerClient,
      }
    })
    .filter(notUndefined)
  logger.info(`Getting networks config finished`)
  return result
}

export type WithExplorer<T extends NetworkConfig> = T & {
  explorerClient: NetworkExplorerClient
}

export function withExplorer(
  config: NetworkConfig,
): config is WithExplorer<NetworkConfig> {
  return !!config.explorerClient
}
