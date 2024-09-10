import { Network, Prisma } from '@prisma/client'
import intersectionWith from 'lodash/intersectionWith.js'
import { nanoid } from 'nanoid'
import {
  arbitrum,
  base,
  blast,
  linea,
  mainnet,
  manta,
  mantle,
  metis,
  mode,
  optimism,
  polygonZkEvm,
  scroll,
  zkSync,
  zora,
} from 'viem/chains'
import { z } from 'zod'
import { env } from '../env.js'
import { isExplorerType } from '../utils/isExplorerType.js'
import { notUndefined } from '../utils/notUndefined.js'
import { zodFetch } from '../utils/zodFetch.js'
import { createPrismaClient } from '../db/prisma.js'

export const chainsConfig = [
  arbitrum,
  mainnet,
  optimism,
  base,
  blast,
  mantle,
  zkSync,
  manta,
  linea,
  mode,
  metis,
  scroll,
  polygonZkEvm,
  zora,
]

const NetworksResponse = z.array(
  z.object({
    id: z.string(),
    chain_identifier: z.number().nullable(),
    name: z.string(),
  }),
)

async function seed() {
  const coingeckoKey = env.COINGECKO_KEY

  if (!coingeckoKey) {
    throw new Error('COINGECKO_KEY is not set')
  }

  const networks = await zodFetch(
    `https://pro-api.coingecko.com/api/v3/asset_platforms?x_cg_pro_api_key=${env.COINGECKO_KEY}`,
    NetworksResponse,
  )

  const desiredNetworks = intersectionWith(
    networks,
    chainsConfig,
    ({ chain_identifier }, { id }) => id === chain_identifier,
  )

  await db.network.upsertMany({
    data: desiredNetworks
      .filter((n) => n.chain_identifier !== null)
      .map((network) => ({
        id: nanoid(),
        coingeckoId: network.id,
        name: network.name,
        // biome-ignore lint/style/noNonNullAssertion: checked above
        chainId: network.chain_identifier!,
      })),
    conflictPaths: ['coingeckoId'],
  })

  const allNetworks = await db.network.findMany()

  await db.networkRpc.createMany({
    data: allNetworks
      .map((network) => {
        let rpcUrl: string | undefined =
          process.env[
            network.name.toUpperCase().split(' ').join('_') + '_RPC_URL'
          ]
        if (!rpcUrl) {
          const chain = chainsConfig.find((c) => c.id === network.chainId)
          rpcUrl = chain?.rpcUrls.default.http[0]
          if (!rpcUrl) {
            return undefined
          }
        }
        return {
          id: nanoid(),
          networkId: network.id,
          url: rpcUrl,
        }
      })
      .filter(notUndefined),
  })

  const consts: Record<string, Partial<Network>> = {
    ethereum: {
      axelarGatewayAddress: '0x4F4495243837681061C4743b74B3eEdf548D56A5',
      axelarId: 'ethereum',
      orbitId: 'eth',
      wormholeId: 'eth',
      layerZeroV1EndpointAddress: '0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675',
      logoUrl:
        'https://assets.coingecko.com/asset_platforms/images/279/standard/ethereum.png?1706606803',
    },
    'arbitrum-one': {
      axelarGatewayAddress: '0xe432150cce91c13a887f7D836923d5597adD8E31',
      axelarId: 'arbitrum',
      wormholeId: 'arbitrum',
      layerZeroV1EndpointAddress: '0x3c2269811836af69497E5F486A85D7316753cf62',
      logoUrl:
        'https://assets.coingecko.com/asset_platforms/images/33/standard/AO_logomark.png?1706606717',
    },
    'optimistic-ethereum': {
      axelarId: 'optimism',
      axelarGatewayAddress: '0xe432150cce91c13a887f7D836923d5597adD8E31',
      wormholeId: 'optimism',
      layerZeroV1EndpointAddress: '0x3c2269811836af69497E5F486A85D7316753cf62',
      logoUrl:
        'https://assets.coingecko.com/asset_platforms/images/41/standard/optimism.png?1706606778',
    },
    base: {
      axelarId: 'base',
      axelarGatewayAddress: '0xe432150cce91c13a887f7D836923d5597adD8E31',
      wormholeId: 'base',
      layerZeroV1EndpointAddress: '0xb6319cC6c8c27A8F5dAF0dD3DF91EA35C4720dd7',
      logoUrl:
        'https://assets.coingecko.com/asset_platforms/images/131/standard/base.jpeg?1706606719',
    },
    linea: {
      axelarId: 'linea',
      axelarGatewayAddress: '0xe432150cce91c13a887f7D836923d5597adD8E31',
      wormholeId: 'linea',
      layerZeroV1EndpointAddress: '0xb6319cC6c8c27A8F5dAF0dD3DF91EA35C4720dd7',
      logoUrl:
        'https://assets.coingecko.com/asset_platforms/images/135/standard/linea.jpeg?1706606705',
    },
  } as const

  await db.$transaction(
    Object.entries(consts).map(([coingeckoId, consts]) =>
      db.network.update({
        where: {
          coingeckoId,
        },
        data: {
          ...consts,
        },
      }),
    ),
  )

  console.log(`Database seeded with ${desiredNetworks.length} networks ✅`)
  await db.networkExplorer.createMany({
    data: allNetworks
      .map((network) => {
        const networkSlug = network.name
          .toLowerCase()
          .replace(' ', '_')
          .toUpperCase()
        const explorerUrl = process.env[`${networkSlug}_EXPLORER_URL`]
        const explorerApiKey = process.env[`${networkSlug}_EXPLORER_API_KEY`]
        const explorerType = process.env[`${networkSlug}_EXPLORER_TYPE`]

        if (!explorerUrl || !explorerApiKey || !explorerType) {
          return
        }

        if (!isExplorerType(explorerType)) {
          throw new Error(`Invalid explorer type: ${explorerType}`)
        }

        console.log(
          'Added explorer for',
          network.name,
          'with type',
          explorerType,
        )

        return {
          id: nanoid(),
          networkId: network.id,
          url: explorerUrl,
          apiKey: explorerApiKey,
          type: explorerType,
        }
      })
      .filter(notUndefined),
  })
}

async function resetDb() {
  const dbUrl = new URL(env.DATABASE_URL)
  if (!dbUrl.host.includes('local')) {
    throw new Error('Cannot truncate other database than local')
  }

  const queries = Object.values(Prisma.ModelName)
    .filter((tableName) => tableName !== 'Cache')
    .map((tableName) => `TRUNCATE TABLE "${tableName}" CASCADE;`)

  await db.$transaction(queries.map((query) => db.$executeRawUnsafe(query)))

  console.log('Database emptied ✅')
}

const db = createPrismaClient()

await resetDb()
await seed()
db.$disconnect()
