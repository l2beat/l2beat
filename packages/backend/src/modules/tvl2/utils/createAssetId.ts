import { EthereumAddress } from '@l2beat/shared-pure'

export type AssetId = string

export function createAssetId(asset: {
  address: EthereumAddress | 'native'
  chain: string
}): AssetId {
  return `${asset.chain}-${asset.address.toString()}`
}
