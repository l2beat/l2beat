type AssetShortName = 'dai' | 'weth' | 'usdt' | 'usdc'

export class Exchange {
  constructor(
    readonly name: string,
    readonly family: string,
    readonly quoteAssetId: string,
    readonly details: Record<string, string | number | boolean> = {}
  ) {}

  static uniswapV1() {
    return new Exchange('uniswap-v1', 'uniswap-v1', 'ether')
  }

  static uniswapV2(asset: AssetShortName) {
    return new Exchange(`uniswap-v2-${asset}`, 'uniswap-v2', toAssetId(asset))
  }

  static uniswapV3(asset: AssetShortName, fee: 500 | 3000 | 10000) {
    return new Exchange(
      `uniswap-v3-${asset}-${fee}`,
      'uniswap-v3',
      toAssetId(asset),
      { fee }
    )
  }

  static fromName(value: string) {
    const parts = value.split('-')
    if (parts[0] === 'uniswap') {
      if (parts[1] === 'v1' && parts.length === 2) {
        return Exchange.uniswapV1()
      } else if (parts[1] === 'v2' && parts.length === 3) {
        return Exchange.uniswapV2(toAssetShortName(parts[2]))
      } else if (parts[1] === 'v3' && parts.length === 4) {
        return Exchange.uniswapV3(
          toAssetShortName(parts[2]),
          toFeeLevel(parts[3])
        )
      }
    }
    throw new TypeError(`Invalid exchange ${value}`)
  }
}

function toAssetShortName(value: string): AssetShortName {
  if (
    value === 'dai' ||
    value === 'weth' ||
    value == 'usdt' ||
    value === 'usdc'
  ) {
    return value
  }
  throw new Error(`Unknown asset ${value}`)
}

function toFeeLevel(value: string) {
  if (value === '500') {
    return 500
  } else if (value === '3000') {
    return 3000
  } else if (value === '10000') {
    return 10000
  }
  throw new Error(`Unknown fee level ${value}`)
}

function toAssetId(asset: AssetShortName) {
  switch (asset) {
    case 'dai':
      return 'dai-stablecoin'
    case 'weth':
      return 'wrapped-ether'
    case 'usdt':
      return 'tether-usd'
    case 'usdc':
      return 'usd-coin'
  }
}
