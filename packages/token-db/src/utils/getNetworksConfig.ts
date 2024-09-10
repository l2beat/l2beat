import { Logger } from '@l2beat/backend-tools'
import { http, PublicClient, createPublicClient } from 'viem'
import * as viemChains from 'viem/chains'
import { PrismaClient } from '../db/prisma.js'
import {
  NetworkExplorerClient,
  instantiateExplorer,
} from './explorers/index.js'
import { notUndefined } from './notUndefined.js'
import { DatabaseCache } from './cache/database-cache.js'

type Dependencies = {
  logger: Logger
  db: PrismaClient
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

  const networks = await db.network.findMany({
    include: {
      rpcs: true,
      explorer: true,
    },
  })

  const chains = Object.values(viemChains) as viemChains.Chain[]

  const result = networks
    .filter((network) => network.rpcs[0]?.url)
    .map((network) => {
      const chain = chains.find((c) => c.id === network.chainId)

      if (!chain) {
        return
      }

      const explorerClient = network.explorer
        ? instantiateExplorer(network.explorer, {
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
          transport: http(network.rpcs[0]?.url, {
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
