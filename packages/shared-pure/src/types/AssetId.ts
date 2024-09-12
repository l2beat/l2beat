import { EthereumAddress } from './EthereumAddress'

export interface AssetId extends String {
  _AssetIdBrand: string
}

export function AssetId(value: string) {
  return value as unknown as AssetId
}

AssetId.create = function (
  chain: string,
  address?: EthereumAddress | 'native',
) {
  return AssetId(`${chain}-${(address ?? 'native').toString()}`)
}

AssetId.ETH = AssetId('ethereum-native')
