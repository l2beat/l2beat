import { Logger, assert } from '@l2beat/backend-tools'
import { nanoid } from 'nanoid'
import { getAddress } from 'viem'
import { z } from 'zod'
import { upsertTokenWithMeta } from '../db/helpers.js'
import { env } from '../env.js'
import { zodFetch } from '../utils/zodFetch.js'
import { TokenUpdateQueue } from '../utils/queue/wrap.js'
import { PrismaClient } from '../db/prisma.js'

type Dependencies = {
  logger: Logger
  db: PrismaClient
  queue: TokenUpdateQueue
}

export function buildOrbitSource({ logger, db, queue }: Dependencies) {
  logger = logger.for('OrbitSource')

  return async () => {
    logger.info(`Syncing tokens from Orbit...`)

    const networks = await db.network
      .findMany({
        include: {
          rpcs: true,
        },
        where: {
          orbitId: {
            not: null,
          },
        },
      })
      .then((result) =>
        result.map((r) => {
          const { orbitId } = r
          assert(orbitId, 'Expected orbitId')
          return {
            ...r,
            orbitId,
          }
        }),
      )

    const res = await zodFetch(env.ORBIT_LIST_URL, OrbitResponse)

    logger.info('Upserting bridge info')

    const { id: externalBridgeId } = await db.externalBridge.upsert({
      select: { id: true },
      where: {
        name: 'Orbit',
        type: 'Orbit',
      },
      create: {
        id: nanoid(),
        name: 'Orbit',
        type: 'Orbit',
      },
      update: {},
    })

    let count = 0

    const tokenIds = new Set<string>()

    for (const token of res.tokenList) {
      logger.debug('Processing token', { symbol: token.symbol })
      const sourceNetwork = networks.find(
        (chain) => chain.orbitId && chain.orbitId === token.chain,
      )

      if (!sourceNetwork) {
        logger.debug('No source network found', {
          symbol: token.symbol,
          chain: token.chain,
        })
        continue
      }

      logger.debug('Upserting source token', { symbol: token.symbol })

      const { tokenId: sourceTokenId } = await upsertTokenWithMeta(db, {
        networkId: sourceNetwork.id,
        address: getAddress(token.address),
        source: { type: 'Orbit' },
        externalId: token.address,
        symbol: token.symbol,
        decimals: token.decimals,
      })

      tokenIds.add(sourceTokenId)
      count++

      for (const [orbitChain, minters] of Object.entries(token.minters)) {
        const targetNetwork = networks.find(
          (chain) => chain.orbitId && chain.orbitId === orbitChain,
        )

        if (!targetNetwork) {
          logger.debug('No target network found', { orbitChain })
          continue
        }

        for (const minter of minters) {
          if (minter.asOrigin) {
            continue
          }

          logger.debug('Processing target token', {
            sourceSymbol: token.symbol,
            targetSymbol: minter.symbol,
          })

          const { tokenId: targetTokenId } = await upsertTokenWithMeta(db, {
            networkId: targetNetwork.id,
            address: getAddress(minter.address),
            source: { type: 'Orbit' },
            externalId: minter.address,
            symbol: minter.symbol,
            decimals: token.decimals,
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
            update: {
              sourceTokenId,
            },
          })
        }

        count++
      }
    }

    await Promise.all([...tokenIds].map((tokenId) => queue.add(tokenId)))
    logger.info(`Synced ${count} tokens from Orbit`)
  }
}

const OrbitResponse = z.object({
  success: z.boolean(),
  tokenList: z.array(
    z.object({
      symbol: z.string(),
      decimals: z.number(),
      governance: z.string(),
      vault: z.string(),
      chain: z.string(),
      address: z.string(),
      minters: z.record(
        z.array(
          z.object({
            address: z.string(),
            minter: z.string().optional(),
            symbol: z.string(),
            mintable: z.boolean(),
            asOrigin: z.boolean(),
          }),
        ),
      ),
    }),
  ),
  nftTokenList: z.array(z.unknown()),
  validators: z.record(
    z.object({
      validators: z.record(z.string()),
      chains: z.array(z.string()),
      chain: z.string(),
    }),
  ),
})
