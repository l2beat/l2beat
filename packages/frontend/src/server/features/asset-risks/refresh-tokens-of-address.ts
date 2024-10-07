import { type TokenRecord } from '@l2beat/database'
import { assert, notUndefined } from '@l2beat/shared-pure'
import {
  http,
  type Address,
  type PublicClient,
  createPublicClient,
  getAddress,
  parseAbiItem,
} from 'viem'
import { db } from '~/server/database'
import { getChain } from './utils/chains'

export async function refreshTokensOfAddress(address: Address) {
  await db.assetRisksUser.upsert({
    address,
  })
  const user = await db.assetRisksUser.findUserByAddress(address)

  assert(user, 'User not found')

  // All tokens grouped by network
  const tokensByNetwork = (await db.token.getAll()).reduce<
    Record<string, TokenRecord[]>
  >((acc, token) => {
    if (!acc[token.networkId]) {
      acc[token.networkId] = []
    }
    acc[token.networkId]?.push(token)
    return acc
  }, {})

  // Network data by id
  const networkMapping = (await db.network.getAllWithConfigs()).reduce(
    (acc, network) => {
      acc[network.id] = network
      return acc
    },
    {} as Record<
      string,
      Awaited<ReturnType<typeof db.network.getAllWithConfigs>>[number]
    >,
  )

  // List of networks to check
  const networksToCheck = Object.keys(tokensByNetwork)
    .map((networkId) => {
      const network = networkMapping[networkId]
      if (!network?.rpc) return undefined
      return network
    })
    .filter(notUndefined)

  const tokens = Object.fromEntries(
    (
      await Promise.allSettled(
        networksToCheck.map<Promise<[string, TokenRecord[]]>>(
          async (network) => {
            const chain = getChain(network.chainId)
            if (!chain) return [network.id, []]

            const client = createPublicClient({
              chain,
              transport: http(),
            })

            const blockNumber = await client.getBlockNumber()
            const logs = await getAllLogs(
              client as unknown as PublicClient,
              address,
              0n,
              blockNumber,
            )
            const tokens = new Set<TokenRecord>()
            for (const log of logs) {
              const token = tokensByNetwork[network.id]?.find(
                (token) => token.address === log.address,
              )
              if (token) {
                tokens.add(token)
              }
            }

            return [network.id, Array.from(tokens)]
          },
        ),
      )
    )
      .filter((p) => p.status === 'fulfilled')
      .map((p) => p.value)
      .filter(([_, tokens]) => tokens.length > 0),
  )

  await db.assetRisksBalance.upsertMany(
    Object.values(tokens).flatMap((tokens) =>
      tokens.map((token) => ({
        userId: user.id,
        tokenId: token.id,
        balance: '0',
      })),
    ),
  )
}

async function getAllLogsInner(
  client: PublicClient,
  address: Address,
  fromBlock: bigint,
  toBlock: bigint,
  mode?: 'from' | 'to',
) {
  console.log('Getting logs from', fromBlock, 'to', toBlock, 'mode', mode)
  return await client.getLogs({
    event: parseAbiItem(
      'event Transfer(address indexed from, address indexed to, uint256 value)',
    ),
    args: {
      from: mode === 'from' ? address : null,
      to: mode === 'to' ? address : null,
    },
    fromBlock,
    toBlock,
  })
}

async function getAllLogs(
  client: PublicClient,
  address: Address,
  fromBlock: bigint,
  toBlock: bigint,
  mode?: 'from' | 'to',
): ReturnType<typeof getAllLogsInner> {
  if (!mode) {
    return Promise.all([
      getAllLogs(client, address, fromBlock, toBlock, 'from'),
      getAllLogs(client, address, fromBlock, toBlock, 'to'),
    ]).then((logs) => logs.flat())
  }

  try {
    return await getAllLogsInner(client, address, fromBlock, toBlock, mode)
  } catch (e) {
    if (
      e instanceof Error &&
      e.message.includes('Log response size exceeded')
    ) {
      const half = (fromBlock + toBlock) / 2n
      return await Promise.all([
        getAllLogs(client, address, fromBlock, half, mode),
        getAllLogs(client, address, half + 1n, toBlock, mode),
      ]).then((logs) => logs.flat())
    } else {
      throw e
    }
  }
}
