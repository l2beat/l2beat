import { CoingeckoId, EthereumAddress } from '@l2beat/shared-pure'

export interface InteropToken {
  coingeckoId: CoingeckoId
  symbol: string
  decimals: number
  addresses: { chain: string; address: EthereumAddress | 'native' }[]
}

export const INTEROP_TOKENS: InteropToken[] = [
  {
    coingeckoId: CoingeckoId('usd-coin'),
    symbol: 'USDC',
    decimals: 6, // TODO: decimals per chain
    addresses: [
      {
        chain: 'ethereum',
        address: EthereumAddress('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'),
      },
      {
        chain: 'arbitrum',
        address: EthereumAddress('0xaf88d065e77c8cC2239327C5EDb3A432268e5831'),
      },
      {
        chain: 'base',
        address: EthereumAddress('0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'),
      },
    ],
  },
  {
    coingeckoId: CoingeckoId('ethereum'),
    symbol: 'ETH',
    decimals: 18, // TODO: decimals per chain
    addresses: [
      {
        chain: 'ethereum',
        address: 'native',
      },
      {
        chain: 'arbitrum',
        address: 'native',
      },
      {
        chain: 'base',
        address: 'native',
      },
    ],
  },
]
