import { chainConverter } from '@l2beat/config'
import generatedJson from '@l2beat/config/src/tokens/generated.json'
import { AssetId, ChainId, EthereumAddress } from '@l2beat/shared-pure'
import {
  http,
  type Address,
  type Hex,
  type PublicClient,
  createPublicClient,
  getAddress,
  parseAbiItem,
} from 'viem'
import { getChain } from './utils/chains'

type Token = Omit<(typeof generatedJson.tokens)[number], 'address'> & {
  address?: Hex
} & { id: AssetId }

export async function getTokensOfAddress(address: Address) {
  const groupedTokens = generatedJson.tokens.reduce<Record<number, Token[]>>(
    (acc, token) => {
      const { chainId, address } = token

      if (!acc[chainId]) {
        acc[chainId] = []
      }
      acc[chainId]?.push({
        ...token,
        id: AssetId.create(
          chainConverter.toName(ChainId(token.chainId)),
          address ? EthereumAddress(address) : 'native',
        ),
        address: address ? getAddress(address) : undefined,
      })

      return acc
    },
    {},
  )

  const chains = Object.keys(groupedTokens).map(Number)

  const tokens = Object.fromEntries(
    (
      await Promise.allSettled(
        chains.map<Promise<[number, Address[]]>>(async (chainId) => {
          const chain = getChain(chainId)
          if (!chain) return [chainId, []]

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
          const tokens = new Set<Address>()
          for (const log of logs) {
            tokens.add(log.address)
          }

          return [chainId, Array.from(tokens)] as [number, Address[]]
        }),
      )
    )
      .filter((p) => p.status === 'fulfilled')
      .map((p) => p.value)
      //.map(([chainId, tokens]) => ([chainId, tokens.filter(token => groupedTokens[chainId]?.some(t => t.address?.toLowerCase() === token.toLowerCase()))] as const))
      .filter(([_, tokens]) => tokens.length > 0),
  )

  return tokens
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
