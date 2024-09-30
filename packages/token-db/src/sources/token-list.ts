import { Logger } from '@l2beat/backend-tools'
import { Database } from '@l2beat/database'
import { getAddress } from 'viem'
import { z } from 'zod'
import { upsertManyTokensWithMeta } from '../db/helpers.js'
import { TokenUpdateQueue } from '../utils/queue/wrap.js'
import { zodFetch } from '../utils/zod-fetch.js'

export { buildTokenListSource }

type Dependencies = {
  url: string
  tag: string
  logger: Logger
  db: Database
  queue: TokenUpdateQueue
}

function buildTokenListSource({ db, url, tag, logger, queue }: Dependencies) {
  logger = logger.for('TokenListSource').tag(`${tag}`)

  return async function () {
    logger.info(`Syncing tokens from token list...`)
    const result = await zodFetch(url, TokenListResponse)

    logger.info('Token list fetched', { count: result.tokens.length })

    const networks = await db.network.getAll()

    const tokens = result.tokens.flatMap((token) => {
      const chain = networks.find((n) => n.chainId === token.chainId)

      if (!chain) {
        logger.debug('Skipping token - chain not found', {
          chainId: token.chainId,
          token,
        })
        return []
      }

      return {
        networkId: chain.id,
        address: getAddress(token.address, chain.chainId),
        symbol: token.symbol,
        decimals: token.decimals,
        name: token.name,
        source: { type: 'TokenList' as const, details: tag },
        logoUrl: token.logoURI ?? null,
        externalId: null,
        contractName: null,
      }
    })

    if (tokens.length === 0) {
      logger.warn('No tokens to insert')
      return
    }

    logger.info('Inserting tokens', { count: tokens.length })

    const tokenIds = await upsertManyTokensWithMeta(db, tokens)

    await Promise.all(tokenIds.map((tokenId) => queue.add(tokenId)))
    logger.info(`Synced ${tokens.length} tokens for token list`)
  }
}

const TokenInfo = z.strictObject({
  chainId: z.number(),
  address: z.string(),
  decimals: z.number(),
  name: z.string(),
  symbol: z.string(),
  logoURI: z.string().optional(),
  tags: z.array(z.string()).optional(),
  extensions: z.record(z.unknown()).optional(),
})

const TokenListResponse = z.strictObject({
  name: z.string(),
  timestamp: z.string(),
  version: z.strictObject({
    major: z.number(),
    minor: z.number(),
    patch: z.number(),
  }),
  tokens: z.array(TokenInfo),
  tokenMap: z.record(TokenInfo).optional(),
  keywords: z.array(z.string()).optional(),
  tags: z
    .record(
      z.strictObject({
        name: z.string(),
        description: z.string(),
      }),
    )
    .optional(),
  logoURI: z.string().optional(),
})
