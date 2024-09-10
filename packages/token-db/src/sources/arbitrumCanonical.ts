import { assert, Logger } from '@l2beat/backend-tools'

import { nanoid } from 'nanoid'
import { getContract, parseAbiItem } from 'viem'
import { PrismaClient } from '../db/prisma.js'
import { NetworkConfig } from '../utils/getNetworksConfig.js'
import { notUndefined } from '../utils/notUndefined.js'

export { buildArbitrumCanonicalSource }

const ARB_RETRYABLE_TX = '0x000000000000000000000000000000000000006E'
const L2_ERC20_GATEWAY = '0x09e9222E96E7B4AE2a407B98d48e330053351EEe'

const abi = [
  parseAbiItem('function l1Address() external view returns (address)'),
]

type Dependencies = {
  logger: Logger
  db: PrismaClient
  networksConfig: NetworkConfig[]
}

function buildArbitrumCanonicalSource({
  db,
  logger,
  networksConfig,
}: Dependencies) {
  logger = logger.for('ArbitrumCanonicalSource')

  return async function () {
    logger.info(`Syncing Arbitrum canonical tokens data...`)

    const arbitrumClient = networksConfig.find(
      (c) => c.name === 'Arbitrum One',
    )?.publicClient
    assert(arbitrumClient, 'Arbitrum One client not found')

    const arbitrumNetwork = await db.network.findFirst({
      select: { id: true },
      where: {
        name: 'Arbitrum One',
      },
    })
    assert(arbitrumNetwork, 'Arbitrum One network not found')

    const tokens = await db.token.findMany({
      where: {
        deployment: {
          OR: [
            {
              to: {
                equals: L2_ERC20_GATEWAY,
                mode: 'insensitive',
              },
            },
            {
              to: {
                equals: ARB_RETRYABLE_TX,
                mode: 'insensitive',
              },
            },
          ],
        },
        metadata: {
          every: {
            contractName: {
              equals: 'ClonableBeaconProxy',
            },
          },
        },
        network: {
          id: arbitrumNetwork.id,
        },
      },
    })

    logger.info('Matching L2 tokens with L1 addresses...')
    const tokensBridgeToUpsert = await Promise.all(
      tokens.map(async (token) => {
        const contract = getContract({
          address: token.address as `0x${string}`,
          abi,
          client: arbitrumClient,
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
      `Synced ${tokensBridgeToUpsert.length} Arbitrum canonical tokens data`,
    )
  }
}
