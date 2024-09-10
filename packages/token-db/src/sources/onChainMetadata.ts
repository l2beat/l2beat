import { Logger } from '@l2beat/backend-tools'

import { getContract, parseAbiItem } from 'viem'
import { upsertManyTokenMeta } from '../db/helpers.js'
import { PrismaClient } from '../db/prisma.js'
import { NetworkConfig } from '../utils/getNetworksConfig.js'
import { notUndefined } from '../utils/notUndefined.js'

export { buildOnChainMetadataSource }

const abi = [
  parseAbiItem('function name() view returns (string)'),
  parseAbiItem('function symbol() view returns (string)'),
  parseAbiItem('function decimals() view returns (uint)'),
]

type Dependencies = {
  logger: Logger
  db: PrismaClient
  networkConfig: NetworkConfig
}

function buildOnChainMetadataSource({
  db,
  logger,
  networkConfig,
}: Dependencies) {
  logger = logger.for('OnChainMetadataSource').tag(networkConfig.name)

  return async function (tokenIds: string[]) {
    logger.info(`Syncing tokens metadata...`)
    const tokens = await db.token.findMany({
      where: {
        OR: tokenIds.map((id) => ({
          id,
        })),
      },
    })

    const tokensWithMetadata = await Promise.all(
      tokens.map(async (token) => {
        const contract = getContract({
          address: token.address as `0x${string}`,
          abi,
          client: networkConfig.publicClient,
        })

        const [nameResult, symbolResult, decimalsResult] =
          await Promise.allSettled([
            contract.read.name(),
            contract.read.symbol(),
            contract.read.decimals(),
          ])

        const name =
          nameResult.status === 'fulfilled' ? nameResult.value : undefined
        const symbol =
          symbolResult.status === 'fulfilled' ? symbolResult.value : undefined
        const decimals =
          decimalsResult.status === 'fulfilled'
            ? Number(decimalsResult.value)
            : undefined

        if ((name && name.length > 256) || (symbol && symbol.length > 32)) {
          return
        }

        return {
          ...token,
          name,
          symbol,
          decimals,
        }
      }),
    )

    const data = tokensWithMetadata.filter(notUndefined).map((token) => ({
      tokenId: token.id,
      name: token.name,
      symbol: token.symbol,
      decimals: token.decimals,
      source: { type: 'OnChain' as const },
    }))

    logger.info('Inserting tokens', { count: tokens.length })
    await upsertManyTokenMeta(db, data)

    logger.info(`Synced ${data.length} tokens metadata`)
  }
}
