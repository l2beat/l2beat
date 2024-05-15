import 'server-only'

import { type Hex } from 'viem'
import {
  type Chain,
  arbitrum, // 42161
  base, // 8453
  blast, // 81457
  boba, // 288
  fraxtal, // 252
  kroma, // 255
  linea, // 59144
  mainnet, // 1
  manta, // 169
  mantle, // 5000
  mode, // 34443
  optimism, // 10
  polygonZkEvm, // 1101
  reyaNetwork, // 1729
  scroll, // 534352
  zkFair, // 42766
  zkSync, // 324
} from 'viem/chains'

import { env } from '~/env'

function createCustomChain({
  id,
  name,
  rpcUrl,
  mutlicallAddress,
}: {
  id: number
  name: string
  rpcUrl: string
  mutlicallAddress?: Hex
}) {
  return {
    id,
    name,
    nativeCurrency: {
      name,
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: [rpcUrl],
      },
    },
    contracts: {
      multicall3: mutlicallAddress
        ? {
            address: mutlicallAddress,
          }
        : undefined,
    },
  } satisfies Chain
}

const supportedChains = [
  {
    ...mainnet,
    rpcUrls: {
      default: {
        http: [env.ETHEREUM_RPC_URL],
      },
    },
  },
  arbitrum,
  base,
  blast,
  boba,
  fraxtal,
  kroma,
  linea,
  manta,
  mantle,
  mode,
  optimism,
  polygonZkEvm,
  reyaNetwork,
  scroll,
  zkFair,
  zkSync,
  createCustomChain({
    id: 957,
    name: 'Lyra',
    rpcUrl: 'https://rpc.lyra.finance',
  }),
  createCustomChain({
    id: 2999,
    name: 'Aevo',
    rpcUrl: 'https://rpc.aevo.xyz',
  }),
]

/**
 * Gets the chain object for the given chain id.
 * @param chainId - Chain id of the target EVM chain.
 * @returns Viem's chain object.
 */
export function getChain(chainId: number) {
  const chain = supportedChains.find((chain) => chain.id === chainId)
  if (!chain) {
    throw new Error(`Chain with id ${chainId} is not supported.`)
  }
  return chain
}
