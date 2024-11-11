import {
  http,
  PublicClient,
  createPublicClient,
  encodeFunctionData,
  parseAbi,
} from 'viem'
import { arbitrum, base, mainnet, optimism } from 'viem/chains'
import { TokenEntry, tokens } from '../schema'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { Balance } from './Balance'
import { toTokenEntry } from './toTokenEntry'

type Chain = 'eth' | 'arb1' | 'oeth' | 'base'

const clients: Record<Chain, PublicClient> = {
  eth: createPublicClient({
    chain: mainnet,
    transport: http(),
    batch: { multicall: true },
  }),
  arb1: createPublicClient({
    chain: arbitrum,
    transport: http(),
    batch: { multicall: true },
  }),
  oeth: createPublicClient({
    chain: optimism,
    transport: http(),
    batch: { multicall: true },
  }) as PublicClient,
  base: createPublicClient({
    chain: base,
    transport: http(),
    batch: { multicall: true },
  }) as PublicClient,
}

async function resolveENS(ens: string): Promise<`0x${string}` | undefined> {
  const address = await clients['eth'].getEnsAddress({ name: ens })
  if (!address) {
    return undefined
  }

  return address
}

async function getBalanceOf(
  holder: `0x${string}`,
  addressWithChain: string,
): Promise<Balance> {
  const [chain, address] = addressWithChain.split(':') as [
    string,
    `0x{string}` | 'native',
  ]

  let balance = 0n
  const client = clients[chain as keyof typeof clients]
  if (address === 'native') {
    const result = await client.getBalance({ address: holder })
    balance = BigInt(result ?? 0x0)
  } else {
    const result = await client.call({
      to: address as `0x{string}`,
      data: encodeFunctionData({
        abi: parseAbi([
          'function balanceOf(address spender) view returns (uint256)',
        ]),
        functionName: 'balanceOf',
        args: [holder],
      }),
    })
    balance = BigInt(result.data ?? 0x0)
  }

  return {
    address: address,
    chain: chain,
    balance,
  } satisfies Balance
}

export function useTokens(
  addressOrENS: string,
): UseQueryResult<TokenEntry[], Error> {
  return useQuery({
    queryKey: ['tokens', addressOrENS],
    queryFn: () => fetchTokens(addressOrENS),
  })
}

export async function fetchTokens(addressOrENS: string) {
  const address = addressOrENS.endsWith('.eth')
    ? await resolveENS(addressOrENS)
    : (addressOrENS as `0x${string}`)
  if (address === undefined) {
    // TODO: ENS resolution failed
    return []
  }
  const balances: Balance[] = (
    await Promise.all(
      tokens.map(async (token) => await getBalanceOf(address, token.address)),
    )
  ).filter((v) => v !== undefined && v.balance !== 0n)

  return balances
    .map(toTokenEntry)
    .filter((v) => v !== undefined)
    .sort((a, b) => b.balanceUsd - a.balanceUsd)
}
