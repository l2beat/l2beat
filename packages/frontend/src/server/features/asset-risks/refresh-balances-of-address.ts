import { type TokenRecord } from '@l2beat/database'
import { TRPCError } from '@trpc/server'
import {
  http,
  type Address,
  createPublicClient,
  getAddress,
  parseAbi,
} from 'viem'
import { db } from '~/server/database'
import { getChain } from './utils/chains'

export async function refreshBalancesOfAddress(address: Address) {
  const user = await db.assetRisksUser.findUserByAddress(address)
  if (!user) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'User not found',
    })
  }

  await db.assetRisksUser.upsert({
    address,
    balancesRefreshedAt: new Date(),
  })

  const balances = await db.assetRisksBalance.getAllForUser(user.id)
  const tokens = await db.token.getByIds(balances.map((b) => b.tokenId))
  const tokensByNetwork = tokens.reduce<Record<string, TokenRecord[]>>(
    (acc, token) => {
      if (!acc[token.networkId]) {
        acc[token.networkId] = []
      }
      acc[token.networkId]?.push(token)
      return acc
    },
    {},
  )

  // TODO: Use getByIds
  const networks = await db.network.getAllWithConfigs()

  // TODO: Observability
  await Promise.allSettled(
    Object.entries(tokensByNetwork).map(async ([networkId, tokens]) => {
      const network = networks.find((n) => n.id === networkId)
      if (!network || !network.chainId || !network.rpc?.url) {
        console.error('Network or RPC URL not found', { networkId })
        return []
      }

      const chain = getChain({
        id: network.chainId,
        name: network.name,
        rpcUrl: network.rpc.url,
      })

      const client = createPublicClient({
        chain,
        transport: http(),
      })

      const { nativeTokens, contractTokens } = tokens.reduce<{
        nativeTokens: TokenRecord[]
        contractTokens: TokenRecord[]
      }>(
        (acc, token) => {
          if (token.address === 'native') {
            acc.nativeTokens.push(token)
          } else {
            acc.contractTokens.push(token)
          }
          return acc
        },
        { nativeTokens: [], contractTokens: [] },
      )

      if (nativeTokens.length > 0) {
        const nativeBalance = await client.getBalance({
          address,
        })
        await db.assetRisksBalance.upsertMany(
          nativeTokens.map((token) => ({
            tokenId: token.id,
            userId: user.id,
            balance: nativeBalance.toString(),
          })),
        )
      }

      if (contractTokens.length > 0) {
        const balances = await client.multicall({
          contracts: contractTokens.map((token) => ({
            abi: erc20Abi,
            address: getAddress(token.address),
            functionName: 'balanceOf',
            args: [address],
          })),
        })

        await db.assetRisksBalance.upsertMany(
          contractTokens.map((token, index) => ({
            tokenId: token.id,
            userId: user.id,
            balance: (balances[index]?.result ?? 0n).toString(),
          })),
        )
      }
    }),
  )
}

const erc20Abi = parseAbi([
  'function balanceOf(address) external view returns (uint256)',
])
