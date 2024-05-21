import generatedJson from '@l2beat/config/src/tokens/generated.json'
import { redirect } from 'next/navigation'
import type { SetRequired } from 'type-fest'
import { http, type Hex, createPublicClient, isAddress, parseAbi } from 'viem'

import { ScalingProjectRisk, layer2s } from '@l2beat/config'
import { getChain, getChainStage } from '~/utils/chains'
import { DetailsHeader } from './_components/DetailsHeader'
import { Disclaimer } from './_components/Disclaimer'
import { TokensTable } from './_components/table/TokensTable'

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

  const hasPositiveBalance = <T extends { balance?: bigint | null }>(
    token: T,
  ): token is T & { balance: bigint } => !!token.balance

  const tokensToDisplay = tokens.filter(hasPositiveBalance).map((token) => {
    if (token.chain.id === 1) return token
    const chain = layer2s.find(
      (l2) => l2.chainConfig?.chainId === token.chain.id,
    )
    if (!chain) return token

    let risks: ScalingProjectRisk[] = []
    risks = chain.technology
      ? [
          chain.technology.stateCorrectness,
          chain.technology.newCryptography,
          chain.technology.dataAvailability,
          chain.technology.operator,
          chain.technology.forceTransactions,
          ...chain.technology.exitMechanisms,
          chain.technology.massExit,
          ...(chain.technology.otherConsiderations ?? []),
        ].flatMap((choice) => choice?.risks ?? [])
      : []

    const stage = getChainStage(token.chain.id)

    return {
      ...token,
      chain: {
        ...token.chain,
        risks,
        stage,
      },
    }
  })

  const vanityAddress = await getAddressDisplayName(address)

  return (
    <main className="max-w-[1176px] w-screen px-0 sm:px-4 md:px-12 mx-auto py-10">
      <div className="flex flex-col gap-6">
        <DetailsHeader
          // TODO: Replace with real data when we have it
          dolarValue={0}
          walletAddress={vanityAddress}
        />
        <TokensTable tokens={tokensToDisplay} />
        <Disclaimer />
      </div>
    </main>
  )
}
