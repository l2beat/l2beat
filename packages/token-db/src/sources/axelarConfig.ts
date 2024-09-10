import { Logger, assert } from '@l2beat/backend-tools'
import { z } from 'zod'

import { nanoid } from 'nanoid'
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
export function buildAxelarConfigSource({ logger, db, queue }: Dependencies) {
  logger = logger.for('AxelarConfigSource')

  return async () => {
    logger.info(`Syncing tokens from Axelar config...`)

    const configUrl = env.AXELAR_CONFIG_URL

    if (!configUrl) {
      logger.info(`Syncing tokens from Axelar config skipped`)
      return
    }

    const res = await zodFetch(configUrl, ConfigResponse)

    logger.info('Upserting bridge info')

    const { id: externalBridgeId } = await db.externalBridge.upsert({
      select: { id: true },
      where: {
        type: 'Axelar',
      },
      create: {
        id: nanoid(),
        name: 'Axelar',
        type: 'Axelar',
      },
      update: {},
    })

    const networks = await db.network
      .findMany({
        include: {
          rpcs: true,
        },
        where: {
          axelarGatewayAddress: {
            not: null,
          },
        },
      })
      .then((result) =>
        result.map((r) => {
          const { axelarGatewayAddress } = r
          assert(axelarGatewayAddress, 'Expected axelarGatewayAddress')
          return {
            ...r,
            axelarGatewayAddress,
          }
        }),
      )

    const tokenIds = new Set<string>()

    for (const definition of Object.values(res)) {
      // Find the native chain aliast in the defintion
      const sourceToken = definition.chain_aliases[definition.native_chain]

      if (!sourceToken) {
        logger.debug('Native chain alias not found, skipping token', {
          sourceNetwork: definition.native_chain,
          token: definition.id,
        })
        continue
      }

      logger.debug('Processing token', {
        sourceNetwork: definition.native_chain,
        token: definition.id,
      })

      const bridgedTokens = Object.entries(definition.chain_aliases).filter(
        ([chain]) => chain !== definition.native_chain,
      )

      // Find the source network in the DB query result
      const sourceNetwork = networks.find(
        (n) => n.axelarId && n.axelarId === definition.native_chain,
      )

      if (!sourceNetwork) {
        logger.debug('Source network not found, skipping token', {
          sourceNetwork: definition.native_chain,
          token: definition.id,
        })
        continue
      }

      // Upsert bridge escrow (once per network)
      // TODO: move it higher to avoid multiple upserts
      await db.bridgeEscrow.upsert({
        select: { id: true },
        where: {
          networkId_address: {
            networkId: sourceNetwork.id,
            address: sourceToken.tokenAddress,
          },
        },
        create: {
          id: nanoid(),
          networkId: sourceNetwork.id,
          address: sourceToken.tokenAddress,
          externalBridgeId,
        },
        update: {},
      })

      // Upsert the source token and its metadata
      const { tokenId: sourceTokenId } = await upsertTokenWithMeta(db, {
        networkId: sourceNetwork.id,
        address: sourceToken.tokenAddress,
        source: { type: 'AxelarConfig' },
        externalId: sourceToken.fullDenomPath,
        symbol: sourceToken.assetSymbol,
        name: sourceToken.assetName,
      })

      tokenIds.add(sourceTokenId)

      // Next, process the bridged tokens
      for (const [chain, token] of bridgedTokens) {
        const network = networks.find((n) => n.axelarId && n.axelarId === chain)

        if (!network) {
          logger.debug('Target network not found, skipping token', {
            sourceNetwork: definition.native_chain,
            targetNetwork: chain,
            token: definition.id,
          })
          continue
        }

        const networkId = network.id
        const address = token.tokenAddress

        // Upsert the target token and its metadata
        const { tokenId: targetTokenId } = await upsertTokenWithMeta(db, {
          networkId,
          address,
          source: { type: 'AxelarConfig' },
          externalId: token.fullDenomPath,
          symbol: token.assetSymbol,
          name: token.assetName,
        })

        tokenIds.add(targetTokenId)

        // Upsert the bridge entry
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

    await Promise.all([...tokenIds].map((tokenId) => queue.add(tokenId)))
    logger.info(`Synced tokens from Axelar config`)
  }
}

const TokenChainConfig = z.object({
  assetSymbol: z.string(),
  assetName: z.string(),
  minDepositAmt: z.number(),
  ibcDenom: z.string(),
  fullDenomPath: z.string(),
  tokenAddress: z.string(),
  mintLimit: z.number(),
})

const TokenDefinition = z.object({
  id: z.string(),
  common_key: z.object({
    devnet: z.string(),
    testnet: z.string(),
    mainnet: z.string(),
  }),
  native_chain: z.string(),
  fully_supported: z.boolean(),
  decimals: z.number(),
  wrapped_erc20: z.string(),
  is_gas_token: z.boolean(),
  gas_token_id: z.string(),
  chain_aliases: z.record(TokenChainConfig),
})

const ConfigResponse = z.record(TokenDefinition)
