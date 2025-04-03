export type TokenId = string & {
  _TokenIdBrand: string
}

export function TokenId(value: string) {
  return value as unknown as TokenId
}

TokenId.create = function (chain: string, symbol: string) {
  return TokenId(`${chain}-${symbol}`)
}
