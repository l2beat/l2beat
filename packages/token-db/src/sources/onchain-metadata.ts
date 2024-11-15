import { Logger } from '@l2beat/backend-tools'

import { Database } from '@l2beat/database'
import { notUndefined } from '@l2beat/shared-pure'
import { getContract, parseAbiItem } from 'viem'
import { upsertManyTokenMeta } from '../db/helpers.js'
import { NetworkConfig } from '../utils/get-networks-config.js'

export { buildOnChainMetadataSource }

const abi = [
  parseAbiItem('function name() view returns (string)'),
  parseAbiItem('function symbol() view returns (string)'),
  parseAbiItem('function decimals() view returns (uint)'),
]

type Dependencies = {
  logger: Logger
  db: Database
  networkConfig: NetworkConfig
}

function buildOnChainMetadataSource({
  db,
  logger,
  networkConfig,
}: Dependencies) {
  logger = logger.for('OnChainMetadataSource').tag({ tag: networkConfig.name })

  return async function (tokenIds: string[]) {
    logger.info(`Syncing tokens metadata...`)
    const tokens = await db.token.getByIds(tokenIds)

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
      name: token.name ?? null,
      symbol: token.symbol ?? null,
      decimals: token.decimals ?? null,
      source: { type: 'OnChain' as const },
      externalId: null,
      logoUrl: null,
      contractName: null,
    }))

    logger.info('Inserting tokens', { count: tokens.length })
    await upsertManyTokenMeta(db, data)

    logger.info(`Synced ${data.length} tokens metadata`)
  }
}
