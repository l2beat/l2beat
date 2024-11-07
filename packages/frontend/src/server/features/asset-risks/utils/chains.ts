import 'server-only'

import { type Chain, type Hex } from 'viem'

export function getChain({
  id,
  name,
  rpcUrl,
  // TODO: this should probably be stored in the database, next to the network
  mutlicallAddress = '0xca11bde05977b3631167028862be2a173976ca11',
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
