import { useEffect, useState } from 'react'
import {
  http,
  PublicClient,
  createPublicClient,
  encodeFunctionData,
  parseAbi,
} from 'viem'
import { arbitrum, base, mainnet, optimism } from 'viem/chains'
import { tokens } from '../schema'

export interface Balance {
  chain: string
  address: string
  balance: bigint
}

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

function isENS(possibleENS: string): boolean {
  return possibleENS.endsWith('.eth')
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

export function useBalances(addressOrENS: string): Balance[] {
  const [resolved, setResolved] = useState<`0x${string}` | undefined>(undefined)
  const [balances, setBalances] = useState<Balance[]>([])

  useEffect(() => {
    async function resolve() {
      const address = isENS(addressOrENS)
        ? await resolveENS(addressOrENS)
        : (addressOrENS as `0x${string}`)
      setResolved(address)
    }
    resolve()
  }, [addressOrENS])

  useEffect(() => {
    async function fetchBalances() {
      if (!resolved) {
        return
      }

      const balances: Balance[] = (
        await Promise.all(
          tokens.map(
            async (token) => await getBalanceOf(resolved, token.address),
          ),
        )
      ).filter((v) => v !== undefined)

      setBalances(balances.filter((x) => x.balance !== 0n))
    }
    fetchBalances()
  }, [resolved])

  return balances
}
