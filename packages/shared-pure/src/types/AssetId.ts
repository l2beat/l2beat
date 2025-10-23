import type { EthereumAddress } from './EthereumAddress.js'

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
AssetId.GPT = AssetId('ethereum-0xCdb4A8742ed7D0259b51E3454C46C9D6C48d5e88')
AssetId.WETH = AssetId('ethereum-0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2')
AssetId.YBETH = AssetId('ethereum-0x76bf2D1e6dFda645c0c17440B17Eccc181dfC351')
AssetId.ZKCRO = AssetId('ethereum-0x28Ff2E4dD1B58efEB0fC138602A28D5aE81e44e2')
