export interface AssetId extends String {
  _AssetIdBrand: string
}

export function AssetId(value: string) {
  if (value === '') {
    throw new TypeError('Invalid AssetId')
  }
  return value as unknown as AssetId
}

AssetId.WETH = AssetId('wrapped-ether')
AssetId.DAI = AssetId('dai-stablecoin')
AssetId.USDT = AssetId('tether-usd')
AssetId.USDC = AssetId('usd-coin')
