import '~/utils/chains'

import generatedJson from '@l2beat/config/src/tokens/generated.json'
import groupBy from 'lodash/groupBy'
import {
  createPublicClient,
  formatUnits,
  type Hex,
  http,
  isAddress,
  parseAbi,
} from 'viem'

import { getChain } from '~/utils/chains'

type Token = Omit<(typeof generatedJson.tokens)[number], 'address'> & {
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

  const ethereum = createPublicClient({
    chain: getChain(1),
    transport: http(),
  })

  const groupedTokens = Object.entries(
    generatedJson.tokens.reduce<Record<number, Token[]>>((acc, token) => {
      const { chainId, address } = token
      // Skip mainnet tokens
      if (chainId === 1) return acc

      // Skip tokens without address
      if (!address || !isAddress(address)) return acc

      if (!acc[chainId]) {
        acc[chainId] = []
      }
      acc[chainId]?.push({
        ...token,
        // To make TypeScript happy
        address,
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

        const publicClient = createPublicClient({
          chain,
          transport: http(),
        })

        if (arr.length < 1) return []

        const results = await (chain.contracts?.multicall3
          ? // Use multicall if available
            publicClient.multicall({
              contracts: (arr ?? []).map((token) => ({
                address: token.address,
                abi: erc20Abi,
                functionName: 'balanceOf',
                args: [address],
              })),
            })
          : // Otherwise, call each contract individually in parallel
            Promise.all(
              arr.map(async (token) => {
                try {
                  const result = await publicClient.readContract({
                    address: token.address,
                    abi: erc20Abi,
                    functionName: 'balanceOf',
                    args: [address],
                  })
                  return { result, status: 'success' as const }
                } catch (error) {
                  return { status: 'failure' as const, error }
                }
              }),
            ))

        return results.map((data, i) => {
          const token = arr[i]
          if (!token) throw new Error('Token not found')
          return {
            token: {
              id: token.id,
              name: token.name,
              decimals: token.decimals,
            },
            chain: {
              id: chainId,
              name: chain.name,
            },
            balance: data.status === 'success' ? data.result : null,
          }
        })
      }),
    )
  ).flat()

  const successes = tokens.filter(({ balance }) => balance !== null)
  const errors = tokens.filter(({ balance }) => balance === null)

  const grouped = Object.entries(
    groupBy(
      tokens.filter(({ balance }) => balance !== null && balance > 0n),
      'chain.id',
    ),
  )

  const resolvedEnsDomain = await ethereum.getEnsName({
    address,
  })

  return (
    <main className="max-w-[1296px] px-4 md:px-12 mx-auto mt-10">
      <div className="flex flex-col gap-12">
        <div>
          <h1 className="mb-1 text-3xl font-bold">
            Hello {resolvedEnsDomain ? resolvedEnsDomain : address}!
          </h1>
          <p>
            Scanned {tokens.length} tokens, success: {successes.length}, errors:{' '}
            {errors.length}
          </p>
        </div>
        <div className="flex flex-col gap-8">
          {Object.keys(grouped).length === 0 && (
            <p>You don&apos;t have any known tokens</p>
          )}
          {grouped.map(([chainIdString, tokens]) => {
            const chainId = Number(chainIdString)
            return (
              <div key={chainId}>
                <h2 className="text-2xl font-bold">{getChain(chainId).name}</h2>
                {tokens.map(({ token, balance }) => (
                  <div key={token.id} className="mt-4">
                    {balance === null ? (
                      <p>
                        We couldn&apos;t check your balance of {token.name} on{' '}
                        {getChain(chainId).name}
                      </p>
                    ) : (
                      <p>
                        You have {formatUnits(balance, token.decimals)}{' '}
                        {token.name} on {getChain(chainId).name}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
        {errors.length > 0 && (
          <div>
            Errors:{' '}
            {errors
              .map(({ token, chain }) => `${token.name} on ${chain.name}`)
              .join(', ')}
          </div>
        )}
      </div>
    </main>
  )
}
