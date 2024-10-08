import { EthereumAddress } from './EthereumAddress'

export type AssetId = string & {
  _AssetIdBrand: string
}

export function AssetId(value: string) {
  return value as unknown as AssetId
}

AssetId.create = function (
  chain: string,
  address: EthereumAddress | 'native' | undefined,
) {
  return AssetId(`${chain}-${(address ?? 'native').toString()}`)
}

AssetId.ETH = AssetId('ethereum-native')
AssetId.WUSDM = AssetId('ethereum-0x57F5E098CaD7A3D1Eed53991D4d66C45C9AF7812')
AssetId.OKB = AssetId('ethereum-0x75231F58b43240C9718Dd58B4967c5114342a86c')
AssetId.WETH = AssetId('ethereum-0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2')
