import { EthereumAddress } from '@l2beat/shared-pure'

export type AssetId = string

export function createAssetId(asset: {
  address?: EthereumAddress | 'native'
  l1Address?: EthereumAddress
  l2BridgeAddress?: EthereumAddress
  wethAddress?: EthereumAddress
  chain: string
}): AssetId {
  return `${asset.chain}-${
    asset.address ??
    asset.l1Address ??
    asset.l2BridgeAddress ??
    asset.wethAddress
  }`
}
