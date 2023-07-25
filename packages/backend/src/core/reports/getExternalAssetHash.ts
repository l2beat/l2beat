import { Layer2ExternalAssets } from '@l2beat/config'
import { Hash256, hashJson } from '@l2beat/shared-pure'
import { sortBy } from 'lodash'

const EXTERNAL_ASSETS_LOGIC_VERSION = 0

export function getExternalAssetsHash(asset: Layer2ExternalAssets): Hash256 {
  return hashJson({
    asset: {
      chainId: asset.chainId.valueOf(),
      assets: sortBy(
        asset.assets.map((x) => {
          return {
            assetId: x.assetId.toString(),
            tokenAddress: x.tokenAddress,
            sinceTimestamp: x.sinceTimestamp.toNumber(),
            decimals: x.decimals,
            premintHolderAddresses: x.premintHolderAddresses,
          }
        }),
        ['assetId', 'tokenAddress'],
      ),
    },
    version: EXTERNAL_ASSETS_LOGIC_VERSION,
  })
}
