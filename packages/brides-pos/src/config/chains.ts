export interface ChainInfo {
  name: string
  addressPrefix: string
  chainId: number
}

export const chains: ChainInfo[] = [
  {
    name: 'ethereum',
    chainId: 1,
    addressPrefix: 'eth',
  },
  {
    name: 'arbitrum',
    chainId: 42161,
    addressPrefix: 'arb1',
  },
  {
    name: 'optimism',
    chainId: 10,
    addressPrefix: 'oeth',
  },
  {
    name: 'polygonpos',
    chainId: 137,
    addressPrefix: 'matic',
  },
  {
    name: 'base',
    chainId: 8453,
    addressPrefix: 'base',
  },
]
