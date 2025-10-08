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

export type AbstractTokenWithDeployedTokens = AbstractToken & {
  deployedTokens: DeployedToken[]
}

export type DeployedToken = {
  id: string
  chain: string
  address: string
  abstractTokenId?: string
  symbol: string
  decimals: number
  deploymentTimestamp: Date
  comment?: string
}

export type TokenConnection = {
  tokenFromId: string
  tokenToId: string
  type: string
  params?: Record<string, unknown>
  comment?: string
}
