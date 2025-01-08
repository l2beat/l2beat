import { AssetId, ChainId, UnixTime } from '@l2beat/shared-pure'

import { ScalingProjectEscrow } from './ScalingProjectEscrow'

export interface ScalingProjectConfig {
  /** Associated tokens are marked on TVL breakdown -- "associated token accounts for X% of TVL" */
  associatedTokens?: string[]
  /** Tokens that can be used to pay the gas fee */
  gasTokens?: string[]
  /** Native tokens should be also marked as associated tokens, however often associated tokens are not native tokens. This has to be kept manually in sync with code executed in CBVUpdater.update.  */
  nativeL2TokensIncludedInTVL?: string[]
  /** Assets external to L1 which should be incorporated into the aggregated TVL report for a given project.  */
  externalAssets?: ProjectExternalAssets
  /** List of contracts in which L1 funds are locked */
  escrows: ScalingProjectEscrow[]
}

export interface ProjectExternalAssets {
  /** Id of the external chain on which assets are held. */
  chainId: ChainId
  /** List of assets to include. */
  assets: {
    /** Id of a given asset. */
    assetId: AssetId
    /** L2 contract address of the asset. */
    tokenAddress: string
    /** "Creation time" of a given asset, we assume that it did not exists before that time. */
    sinceTimestamp: UnixTime
    /** How fine grained the asset is */
    decimals: number
  }[]
}
