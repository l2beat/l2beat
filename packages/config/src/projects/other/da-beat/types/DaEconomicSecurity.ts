export const DaEconomicSecurityType = {
  Ethereum: 'Ethereum',
  Celestia: 'Celestia',
  Near: 'Near',
  Avail: 'Avail',
} as const

export type DaEconomicSecurityType =
  (typeof DaEconomicSecurityType)[keyof typeof DaEconomicSecurityType]

export interface DaEconomicSecurityMeta {
  /** Symbol of the token used for economic security. */
  symbol: string
  /** Decimals of the token used for economic security. */
  decimals: number
  /** CoinGecko id of the token used for economic security. */
  coingeckoId: string
}

export interface DaEconomicSecurity {
  /** The type of the economic security calculation. */
  type: DaEconomicSecurityType
}

export const daEconomicSecurityMeta: Record<
  DaEconomicSecurityType,
  DaEconomicSecurityMeta
> = {
  Ethereum: {
    symbol: 'ETH',
    decimals: 18,
    coingeckoId: 'ethereum',
  },
  Celestia: {
    symbol: 'TIA',
    decimals: 6,
    coingeckoId: 'celestia',
  },
  Near: {
    symbol: 'NEAR',
    decimals: 24,
    coingeckoId: 'near',
  },
  Avail: {
    symbol: 'AVAIL',
    decimals: 18,
    coingeckoId: 'avail',
  },
}
