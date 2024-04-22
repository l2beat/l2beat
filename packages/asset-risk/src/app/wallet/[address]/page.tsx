import '~/utils/chains'

// TODO(imxeno): Importing it like this since it spits some errors about bobanetwork (?)
import generatedJson from '@l2beat/config/src/tokens/generated.json'
import { createPublicClient, type Hex, http, isAddress, parseAbi } from 'viem'

import { getChain } from '~/utils/chains'

type Token = (typeof generatedJson.tokens)[number] & {
  address: Hex
}

export default async function Page({
  params: { address },
}: {
  params: { address: string }
}) {
  if (!isAddress(address)) {
    throw new Error('Invalid address')
  }

  const groupedTokens = Object.entries(
    generatedJson.tokens.reduce<Record<number, Token[]>>((acc, token) => {
      // Skip mainnet tokens
      if (token.chainId === 1) return acc

      // Skip tokens without address
      if (!token.address || !isAddress(token.address)) return acc

      if (!acc[token.chainId]) {
        acc[token.chainId] = []
      }
      acc[token.chainId]?.push({
        ...token,
        // To make TypeScript happy
        address: token.address,
      })

      return acc
    }, {}),
  ).map(([chainId, arr]) => [Number(chainId), arr] as const)

  const erc20Abi = parseAbi([
    'function balanceOf(address) external view returns (uint256)',
  ])
  const tokens = (
    await Promise.all(
      groupedTokens.map(async ([chainId, arr]) => {
        const chain = getChain(chainId)

        // TODO(imxeno): This is a temporary fix for the missing multicall3 contract.
        // remove this and handle it properly later
        if (!chain.contracts?.multicall3) {
          return []
        }

        const publicClient = createPublicClient({
          chain,
          transport: http(),
        })

        if (arr.length < 1) return []

        const results = await publicClient.multicall({
          contracts: (arr ?? []).map((token) => ({
            address: token.address,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [address],
          })),
        })

        return results.map((data, i) => {
          const token = arr[i]
          if (!token) throw new Error('Token not found')
          return {
            token: {
              id: token.id,
              name: token.name,
            },
            chain: {
              id: chainId,
              name: chain.name,
            },
            balance: data.status === 'success' ? data.result.toString() : null,
          }
        })
      }),
    )
  ).flat()

  return (
    <main>
      <pre>{JSON.stringify(tokens, null, 2)}</pre>
      <h1>Hello {address}!</h1>
    </main>
  )
}
