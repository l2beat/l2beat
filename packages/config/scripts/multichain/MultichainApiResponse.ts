export interface MultichainApiResponse {
  /** all are prefixed evm0x except ether evmeth0x */
  [prefixedAddress: string]: TokenDescription
}

export interface TokenDescription {
  name: string
  symbol: string
  decimals: number
  address: string
  price: number
  logoUrl: string
  tokenType: 'TOKEN' | 'NATIVE'
  chainId: string
  destChains: DestinationChains
}

export interface DestinationChains {
  /** either evm chain id or literal like BTC */
  [chainId: string]: ChainRoutes
}

export interface ChainRoutes {
  [routeHash: string]: RouteDescription
}

export interface RouteDescription {
  address: string
  name: string
  symbol: string
  decimals: number
  anytoken: {
    address: string
    name: string
    symbol: string
    decimals: number
  }
  fromanytoken: {
    address: string
    name: string
    symbol: string
    decimals: number
    chainid: string
  }
  underlying:
    | {
        address: string
        name: string
        symbol: string
        decimals: number
      }
    | false
  type: string
  /** address */
  router: string
  tokenId: string
  routerAbi: string
  isLiquidity: boolean
  isApprove: boolean
  isFromLiquidity: boolean
  /** address */
  spender: string
  /** number as string */
  BigValueThreshold: string
  /** number as string */
  MaximumSwap: string
  /** number as string */
  MaximumSwapFee: string
  /** number as string */
  MinimumSwap: string
  /** number as string */
  MinimumSwapFee: string
  SwapFeeRatePerMillion: number
  pairid: string
  /** address or empty string */
  DepositAddress: string
  /** address or empty string */
  BaseFeePercent: string
  sortId: number
  tokenType: string
  chainId: string
}
