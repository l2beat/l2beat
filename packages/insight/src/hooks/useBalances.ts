import { useEffect, useState } from 'react'
import {
  http,
  createPublicClient,
  encodeFunctionData,
  parseAbi,
  PublicClient,
} from 'viem'
import { mainnet, arbitrum, optimism } from 'viem/chains'

export interface Balance {
  chain: string
  address: string
  balance: bigint
}

type Chain = 'eth' | 'arb1' | 'oeth'

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
}

interface Token {
  address: string
  chain: Chain
  name: string
}

const Tokens: Token[] = [
  {
    name: 'USDT',
    chain: 'eth',
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  },
  {
    name: 'stETH',
    chain: 'eth',
    address: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
  },
  {
    name: 'USDC.e',
    chain: 'arb1',
    address: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
  },
  {
    name: 'WBTC',
    chain: 'arb1',
    address: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
  },
  {
    name: 'DAI',
    chain: 'oeth',
    address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
  },
  {
    name: 'OP',
    chain: 'oeth',
    address: '0x4200000000000000000000000000000000000042',
  },
]

function isENS(possibleENS: string): boolean {
  return possibleENS.endsWith('.eth')
}

async function resolveENS(ens: string): Promise<string | undefined> {
  const address = await clients['eth'].getEnsAddress({ name: ens })
  if (!address) {
    return undefined
  }

  return address.toString()
}

export function useBalances(addressOrENS: string): Balance[] {
  const [resolved, setResolved] = useState<string | undefined>(undefined)
  const [balances, setBalances] = useState<Balance[]>([])

  useEffect(() => {
    async function resolve() {
      const address = isENS(addressOrENS)
        ? await resolveENS(addressOrENS)
        : addressOrENS
      setResolved(address)
    }
    resolve()
  }, [addressOrENS])

  useEffect(() => {
    async function fetchBalances() {
      if (!resolved) {
        return
      }

      const balances: Balance[] = await Promise.all(
        Tokens.map(async (token) => {
          const result = await clients[
            token.chain as keyof typeof clients
          ].call({
            to: token.address as `0x{string}`,
            data: encodeFunctionData({
              abi: parseAbi([
                'function balanceOf(address spender) view returns (uint256)',
              ]),
              functionName: 'balanceOf',
              args: [resolved as `0x{string}`],
            }),
          })

          return {
            address: token.address,
            chain: token.chain,
            balance: BigInt(result.data ?? 0x0),
          } satisfies Balance
        }),
      )

      setBalances(balances)
    }
    fetchBalances()
  }, [resolved])

  return balances
}
