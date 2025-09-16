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
    coingeckoId: CoingeckoId('tether'),
    symbol: 'USDT',
    decimals: 6, // TODO: decimals per chain
    addresses: [
      {
        chain: 'ethereum',
        address: EthereumAddress('0xdAC17F958D2ee523a2206206994597C13D831ec7'),
      },
      {
        chain: 'arbitrum',
        address: EthereumAddress('0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9'),
      },
      {
        chain: 'base',
        address: EthereumAddress('0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'),
      },
    ],
  },
  {
    coingeckoId: CoingeckoId('weth'),
    symbol: 'WETH',
    decimals: 18, // TODO: decimals per chain
    addresses: [
      {
        chain: 'ethereum',
        address: EthereumAddress('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'),
      },
      {
        chain: 'arbitrum',
        address: EthereumAddress('0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'),
      },
      {
        chain: 'base',
        address: EthereumAddress('0x4200000000000000000000000000000000000006'),
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
