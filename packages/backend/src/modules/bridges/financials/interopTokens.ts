import { CoingeckoId, EthereumAddress } from '@l2beat/shared-pure'

import tokens from './generatedInterop.json'

export interface InteropToken {
  coingeckoId: CoingeckoId
  symbol: string
  decimals: number
  addresses: { chain: string; address: EthereumAddress | 'native' }[]
}

export function getInteropTokens(): InteropToken[] {
  return tokens.map((t) => ({
    ...t,
    coingeckoId: CoingeckoId(t.coingeckoId),
    addresses: t.addresses.map((a) => ({
      chain: a.chain,
      address:
        a.address === 'native'
          ? ('native' as const)
          : EthereumAddress(a.address),
    })),
  }))
}
