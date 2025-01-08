export interface DiscoveredTokens {
  found: {
    address: string
    escrows: {
      project: string
      address: string
      balance?: number
      value?: number
      preminted?: true
    }[]
    coingeckoId?: string
    symbol?: string
    marketCap?: number
    exceedsCirculatingSupply?: true
  }[]
}

export interface ProcessedEscrows {
  processed: Record<string, number>
}
