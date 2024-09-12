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
AssetId.WUSDM = AssetId('ethereum-0x57F5E098CaD7A3D1Eed53991D4d66C45C9AF7812')
