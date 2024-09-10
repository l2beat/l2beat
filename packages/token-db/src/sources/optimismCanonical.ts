import { assert, Logger } from '@l2beat/backend-tools'

import { nanoid } from 'nanoid'
import { getContract, parseAbiItem } from 'viem'
import { PrismaClient } from '../db/prisma.js'
import { NetworkConfig } from '../utils/getNetworksConfig.js'
import { notUndefined } from '../utils/notUndefined.js'

export { buildOptimismCanonicalSource }

const OPTIMISM_BRIDGE_3 = '0x4200000000000000000000000000000000000012'
const OVM_TOKEN_FACTORY = '0x2e985AcD6C8Fa033A4c5209b0140940E24da7C5C'

const abi = [parseAbiItem('function l1Token() external view returns (address)')]

type Dependencies = {
  logger: Logger
  db: PrismaClient
  networksConfig: NetworkConfig[]
}

function buildOptimismCanonicalSource({
  db,
  logger,
  networksConfig,
}: Dependencies) {
  logger = logger.for('OptimismCanonicalSource')

  return async function () {
    logger.info(`Syncing Optimism canonical tokens data...`)

    const optimismClient = networksConfig.find(
      (c) => c.name === 'Optimism',
    )?.publicClient
    assert(optimismClient, 'Optimism client not found')

    const optimismNetwork = await db.network.findFirst({
      select: { id: true },
      where: {
        name: 'Optimism',
      },
    })
    assert(optimismNetwork, 'Optimism network not found')

    const tokens = await db.token.findMany({
      where: {
        deployment: {
          OR: [
            {
              to: {
                equals: OPTIMISM_BRIDGE_3,
                mode: 'insensitive',
              },
            },
            {
              to: {
                equals: OVM_TOKEN_FACTORY,
                mode: 'insensitive',
              },
            },
          ],
        },
        network: {
          id: optimismNetwork.id,
        },
      },
    })

    logger.info('Matching L2 tokens with L1 addresses...')
    const tokensBridgeToUpsert = await Promise.all(
      tokens.map(async (token) => {
        const contract = getContract({
          address: token.address as `0x${string}`,
          abi,
          client: optimismClient,
        })

        const l1Address = await contract.read.l1Token().catch(() => undefined)
        const l1Token = await db.token.findFirst({
          where: {
            network: {
              name: 'Ethereum',
            },
            address: {
              equals: l1Address,
              mode: 'insensitive',
            },
          },
        })
        if (!l1Token) {
          return
        }

        return {
          sourceTokenId: l1Token.id,
          targetTokenId: token.id,
        }
      }),
    )

    await db.tokenBridge.upsertMany({
      data: tokensBridgeToUpsert
        .filter(notUndefined)
        .map((t) => ({ id: nanoid(), ...t })),
      conflictPaths: ['targetTokenId'],
    })

    logger.info(
      `Synced ${tokensBridgeToUpsert.length} Optimism canonical tokens data`,
    )
  }
}
