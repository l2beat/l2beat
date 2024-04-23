import generatedJson from '@l2beat/config/src/tokens/generated.json'
import groupBy from 'lodash/groupBy'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createPublicClient, type Hex, http, isAddress, parseAbi } from 'viem'

import { getChain } from '~/utils/chains'

import { ChainAssetRiskCard } from './_components/ChainAssetRiskCard'

type Token = Omit<(typeof generatedJson.tokens)[number], 'address'> & {
  address: Hex
}

export default async function Page({
  params: { address },
}: {
  params: { address: string }
}) {
  if (!isAddress(address)) {
    return redirect('/')
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
              symbol: token.symbol,
              iconUrl: token.iconUrl,
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

  const hasPositiveBalance = <T extends { balance?: bigint | null }>(
    token: T,
  ): token is T & { balance: bigint } => !!token.balance

  const grouped = Object.entries(
    groupBy(tokens.filter(hasPositiveBalance), 'chain.id'),
  )

  const resolvedEnsDomain = await ethereum.getEnsName({
    address,
  })

  return (
    <main className="max-w-[1296px] px-4 md:px-12 mx-auto py-10">
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-8">
          <div>
            <Link href="/">&lt; Back</Link>
          </div>
          <div className="flex flex-row gap-16 justify-between">
            <div>
              <h1 className="mb-1 text-3xl font-bold">
                {resolvedEnsDomain ? resolvedEnsDomain : address}&apos;s Asset
                Risk
              </h1>
              <p className="text-gray-500 dark:text-gray-600k">
                Risk score assessment for{' '}
                {resolvedEnsDomain ? resolvedEnsDomain : address}, based on{' '}
                {tokens.length} known tokens. We successfully got info for{' '}
                {successes.length} of them, while {errors.length} errored. Risk
                is very important lorem ipsum dolor sit amet. Risk is very
                important lorem ipsum dolor sit amet. Risk is very important
                lorem ipsum dolor sit amet.
              </p>
            </div>
            <div className="dark:bg-zinc-900 bg-gray-100 h-32 w-32 flex-shrink-0 rounded-lg items-center justify-center flex">
              risk score?
            </div>
          </div>
          <div className="px-4 py-6 md:p-10 dark:bg-zinc-900 bg-gray-100 rounded-lg">
            risk breakdown?
          </div>
        </div>
        <hr className="w-full border-gray-200 dark:border-zinc-700 md:border-t" />
        <div className="flex flex-col gap-8">
          {Object.keys(grouped).length === 0 && (
            <p>You don&apos;t have any known tokens</p>
          )}
          {grouped.map(([chainIdString, tokens]) => {
            const chainId = Number(chainIdString)
            return (
              <ChainAssetRiskCard
                key={chainId}
                id={chainId}
                name={tokens[0]?.chain.name ?? ''}
                tokens={tokens}
              />
            )
          })}
          {errors.length > 0 && (
            <div className="text-center text-xs py-4">
              Errors:{' '}
              {errors
                .map(
                  ({ token, chain }) =>
                    `${token.name} on ${chain.name} (${token.id})`,
                )
                .join(', ')}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
