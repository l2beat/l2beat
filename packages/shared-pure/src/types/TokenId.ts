export type TokenId = string & {
  _TokenIdBrand: string
}

export function TokenId(value: string) {
  return value as unknown as TokenId
}

TokenId.create = function (chain: string, symbol: string, priceId: string) {
  if (TokenId.SYMBOL_DUPLICATES.includes(symbol)) {
    return TokenId(`${chain}-${symbol}.${priceId}`)
  } else {
    return TokenId(`${chain}-${symbol}`)
  }
}

TokenId.SYMBOL_DUPLICATES = [
  'GAME',
  'mETH',
  'MOON',
  'USDN',
  'USDT',
  'USDC',
  'WETH',
  'SOL',
  'USDC.e',
  'wBTC',
]
