import Papa from 'papaparse'
import { getAddress } from 'viem'
import { z } from 'zod'

import { Logger, assert } from '@l2beat/backend-tools'
import { nanoid } from 'nanoid'
import { upsertTokenWithMeta } from '../db/helpers.js'
import { env } from '../env.js'
import { PrismaClient } from '../db/prisma.js'
import { TokenUpdateQueue } from '../utils/queue/wrap.js'

type Dependencies = {
  logger: Logger
  db: PrismaClient
  queue: TokenUpdateQueue
}

export function buildWormholeSource({ logger, db, queue }: Dependencies) {
  logger = logger.for('WormholeSource')

  return async () => {
    logger.info(`Syncing tokens from Wormhole...`)
    const networks = await db.network
      .findMany({
        include: {
          rpcs: true,
        },
        where: {
          wormholeId: {
            not: null,
          },
        },
      })
      .then((result) =>
        result.map((r) => {
          const { wormholeId } = r
          assert(wormholeId, 'Expected wormholeId')
          return {
            ...r,
            wormholeId,
          }
        }),
      )

    logger.info('Upserting bridge info')

    const { id: externalBridgeId } = await db.externalBridge.upsert({
      select: { id: true },
      where: {
        name: 'Wormhole',
        type: 'Wormhole',
      },
      create: {
        id: nanoid(),
        name: 'Wormhole',
        type: 'Wormhole',
      },
      update: {},
    })

    const res = await fetch(env.WORMHOLE_LIST_URL)

    const data = await res.text()
    const rawParsed = Papa.parse(data, {
      header: true,
      skipEmptyLines: true,
    }).data
    const parsed = z.array(WormholeToken).parse(rawParsed)
    const normalized = parsed.map((token) => {
      const entry = {
        chain: token.source,
        symbol: token.symbol,
        name: token.name,
        address: token.sourceAddress,
        coingeckoId: token.coingeckoId,
        logo: token.logo,
        chains: [] as { chain: string; address: string }[],
      }
      for (const [key, value] of Object.entries(token)) {
        if (key.endsWith('Address') && key !== 'sourceAddress' && value) {
          const address = z.string().parse(value)
          entry.chains.push({
            chain: key.slice(0, -'Address'.length),
            address,
          })
        }
      }
      return entry
    })

    const tokenIds = new Set<string>()

    for (const token of normalized) {
      const sourceChain = networks.find(
        (chain) => chain.wormholeId && chain.wormholeId === token.chain,
      )

      if (!sourceChain) {
        logger.debug('Source network not found, skipping token', {
          sourceNetwork: token.chain,
          token: token.address,
        })
        continue
      }

      const { tokenId: sourceTokenId } = await upsertTokenWithMeta(db, {
        networkId: sourceChain.id,
        address: getAddress(token.address),
        source: { type: 'Wormhole' },
        externalId: token.address,
        symbol: token.symbol,
        name: token.name,
        logoUrl: token.logo,
      })

      tokenIds.add(sourceTokenId)

      for (const wrapped of token.chains) {
        const destinationChain = networks.find(
          (chain) => chain.wormholeId && chain.wormholeId === wrapped.chain,
        )
        if (destinationChain) {
          const { tokenId: targetTokenId } = await upsertTokenWithMeta(db, {
            networkId: destinationChain.id,
            address: getAddress(wrapped.address),
            source: { type: 'Wormhole' },
            externalId: token.address,
            symbol: token.symbol,
            name: token.name,
            logoUrl: token.logo,
          })

          tokenIds.add(targetTokenId)

          await db.tokenBridge.upsert({
            where: {
              targetTokenId,
            },
            create: {
              id: nanoid(),
              sourceTokenId,
              targetTokenId,
              externalBridgeId,
            },
            update: {},
          })
        }
      }
    }

    await Promise.all([...tokenIds].map((tokenId) => queue.add(tokenId)))
    logger.info(`Synced tokens from Wormhole`)
  }
}

const WormholeToken = z
  .object({
    source: z.string(),
    symbol: z.string(),
    name: z.string(),
    sourceAddress: z.string(),
    sourceDecimals: z.string(),
    coingeckoId: z.string(),
    logo: z.string(),
  })
  .passthrough()
