import { assert, Logger } from '@l2beat/backend-tools'

import { nanoid } from 'nanoid'
import { getContract, parseAbiItem } from 'viem'
import { PrismaClient } from '../db/prisma.js'
import { NetworkConfig } from '../utils/getNetworksConfig.js'
import { notUndefined } from '../utils/notUndefined.js'

export { buildZkSyncCanonicalSource }

const ZKSYNC_DEPLOYER = '0x689a1966931eb4bb6fb81430e6ce0a03aabdf174'

const abi = [
  parseAbiItem('function l1Address() external view returns (address)'),
]

type Dependencies = {
  logger: Logger
  db: PrismaClient
  networksConfig: NetworkConfig[]
}

function buildZkSyncCanonicalSource({
  db,
  logger,
  networksConfig,
}: Dependencies) {
  logger = logger.for('ZkSyncCanonicalSource')

  return async function () {
    logger.info(`Syncing ZkSync canonical tokens data...`)

    const zkSyncClient = networksConfig.find(
      (c) => c.name === 'zkSync',
    )?.publicClient
    assert(zkSyncClient, 'zkSync client not found')

    const zkSyncNetwork = await db.network.findFirst({
      select: { id: true },
      where: {
        name: 'zkSync',
      },
    })
    assert(zkSyncNetwork, 'zkSync network not found')

    const tokens = await db.token.findMany({
      where: {
        deployment: {
          OR: [
            {
              from: {
                equals: ZKSYNC_DEPLOYER,
                mode: 'insensitive',
              },
            },
          ],
        },
        network: {
          id: zkSyncNetwork.id,
        },
      },
    })

    logger.info('Matching L2 tokens with L1 addresses...')
    const tokensBridgeToUpsert = await Promise.all(
      tokens.map(async (token) => {
        const contract = getContract({
          address: token.address as `0x${string}`,
          abi,
          client: zkSyncClient,
        })

        const l1Address = await contract.read.l1Address().catch(() => undefined)
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
      `Synced ${tokensBridgeToUpsert.length} zkSync canonical tokens data`,
    )
  }
}
