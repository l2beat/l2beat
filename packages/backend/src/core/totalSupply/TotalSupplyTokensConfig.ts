import { Layer2ExternalAssets } from '@l2beat/config'

export type TotalSupplyTokensConfig = Pick<
  Layer2ExternalAssets['assets'][0],
  'assetId' | 'tokenAddress' | 'sinceTimestamp' | 'decimals'
>
