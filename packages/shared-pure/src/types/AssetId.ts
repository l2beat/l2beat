export interface AssetId extends String {
  _AssetIdBrand: string
}

export function AssetId(value: string) {
  if (value === '') {
    throw new TypeError('Invalid AssetId')
  }
  return value as unknown as AssetId
}

AssetId.WETH = AssetId('weth-wrapped-ether')
AssetId.DAI = AssetId('dai-dai-stablecoin')
AssetId.USDT = AssetId('usdt-tether-usd')
AssetId.USDC = AssetId('usdc-usd-coin')
AssetId.ETH = AssetId('eth-ether')
AssetId.OP = AssetId('op-optimism')
AssetId.ARB = AssetId('arb-arbitrum')

AssetId.fake = function fake(name?: string) {
  if (name) {
    return AssetId(`fake-${name}`)
  }
  const letters = 'abcdefghijklmnopqrstuvwxyz'
  const letter = () => letters[Math.floor(Math.random() * letters.length)]
  return AssetId('fake-' + Array.from({ length: 10 }).map(letter).join(''))
}
