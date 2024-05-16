import generatedJson from '@l2beat/config/src/tokens/generated.json'
import groupBy from 'lodash/groupBy'
import { redirect } from 'next/navigation'
import type { SetRequired } from 'type-fest'
import { http, type Hex, createPublicClient, isAddress, parseAbi } from 'viem'

import { getChain } from '~/utils/chains'

import { ChainAssetRiskCard } from './_components/ChainAssetRiskCard'
import { DetailsHeader } from './_components/DetailsHeader'

type Token = Omit<(typeof generatedJson.tokens)[number], 'address'> & {
  address?: Hex
}

interface Props {
  params: { address: string }
}

async function getAddressDisplayName(address: Hex) {
  const ethereum = createPublicClient({
    chain: getChain(1),
    transport: http(),
  })

  const resolvedEnsDomain = await ethereum.getEnsName({
    address,
  })

  return resolvedEnsDomain ?? address
}

export async function generateMetadata({ params: { address } }: Props) {
  if (!isAddress(address)) return {}
  return {
    title: `${await getAddressDisplayName(
      address,
    )}'s Asset Risk Report – L2BEAT`,
    description: 'Detailed risk assessment for your L2 assets.',
  }
}

export default async function Page({ params: { address } }: Props) {
  if (!isAddress(address)) {
    return redirect('/')
  }

  const groupedTokens = Object.entries(
    generatedJson.tokens.reduce<Record<number, Token[]>>((acc, token) => {
      const { chainId, address } = token

      if (!acc[chainId]) {
        acc[chainId] = []
      }
      acc[chainId]?.push({
        ...token,
        // To make TypeScript happy
        address: address && isAddress(address) ? address : undefined,
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

        const nativeToken: Omit<Token, 'address'> | undefined = arr.find(
          (token) => !token.address,
        )

        const tokenAddresses = arr.filter(
          (token): token is SetRequired<Token, 'address'> =>
            Boolean(token.address),
        )

        const results = await (chain.contracts?.multicall3
          ? // Use multicall if available
            publicClient.multicall({
              contracts: tokenAddresses.map((token) => ({
                address: token.address,
                abi: erc20Abi,
                functionName: 'balanceOf',
                args: [address],
              })),
            })
          : // Otherwise, call each contract individually in parallel
            Promise.all(
              tokenAddresses.map(async (token) => {
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

        const nativeTokenBalance =
          nativeToken &&
          (await publicClient.getBalance({ address }).catch(() => null))

        return [
          ...(nativeToken
            ? [
                {
                  token: {
                    id: nativeToken.id,
                    name: nativeToken.name,
                    decimals: nativeToken.decimals,
                    symbol: nativeToken.symbol,
                    iconUrl: nativeToken.iconUrl,
                    bridge: null,
                  },
                  chain: {
                    id: chainId,
                    name: chain.name,
                  },
                  balance: nativeTokenBalance ?? null,
                },
              ]
            : []),
          ...results.map((data, i) => {
            const token = tokenAddresses[i]
            if (!token) throw new Error('Token not found')
            return {
              token: {
                id: token.id,
                name: token.name,
                decimals: token.decimals,
                symbol: token.symbol,
                iconUrl: token.iconUrl,
                bridge: token.bridgedUsing?.slug,
              },
              chain: {
                id: chainId,
                name: chain.name,
              },
              balance: data.status === 'success' ? data.result : null,
            }
          }),
        ]
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

  const vanityAddress = await getAddressDisplayName(address)

  return (
    <main className="max-w-[1296px] px-4 md:px-12 mx-auto py-10">
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-8">
          <DetailsHeader
            dolarValue={2631773480.22}
            walletAddress="0x4865A7018c9748f69cDcC76Be1daCD40D1cD685a"
          />
          <h1 className="mb-1 text-3xl font-bold">
            {vanityAddress}&apos;s Asset Risk
          </h1>
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
