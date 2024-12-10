export interface DiscoveredTokens {
  found: {
    address: string
    escrows: {
      project: string
      address: string
      balance?: number
      value?: number
    }[]
    coingeckoId?: string
    symbol?: string
    marketCap?: number
  }[]
}

export interface ProcessedEscrows {
  processed: Record<string, number>
}
