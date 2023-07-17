import { AssetId, EthereumAddress, UnixTime } from '@l2beat/shared-pure'

export interface TotalSupplyTokensConfig {
  assetId: AssetId
  tokenAddress: EthereumAddress
  sinceTimestamp: UnixTime
  decimals: number
}
