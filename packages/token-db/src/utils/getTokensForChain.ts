import { PrismaClient } from '../db/prisma.js'
import { NetworkConfig, WithExplorer } from './getNetworksConfig.js'

type Dependencies = {
  db: PrismaClient
  networkConfig: WithExplorer<NetworkConfig>
}

type Options = {
  /**
   * If true, the source will fetch the data for all tokens from scratch.
   */
  flush: boolean
}

export async function getTokensForChain(
  { db, networkConfig }: Dependencies,
  { flush }: Options = { flush: false },
) {
  const whereClause = flush
    ? { network: { chainId: networkConfig.chainId } }
    : {
        AND: {
          network: { chainId: networkConfig.chainId },
          deployment: { is: null },
        },
      }

  const tokens = await db.token.findMany({
    where: whereClause,
  })
  return tokens
}
