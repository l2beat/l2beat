export type AbstractToken = {
  id: string
  issuer?: string
  symbol: string
  category: 'btc' | 'ether' | 'stablecoin' | 'other'
  iconUrl?: string
  coingeckoId?: string
  coingeckoListingTimestamp?: Date
  comment?: string
}

export type DeployedToken = {
  id: number
  chain: string
  address: string
  abstractTokenId?: string
  symbol: string
  decimals: number
  deploymentTimestamp: Date
  comment?: string
}

export type TokenConnection = {
  tokenFromId: number
  tokenToId: number
  type: string
  params?: Record<string, unknown>
  comment?: string
}
