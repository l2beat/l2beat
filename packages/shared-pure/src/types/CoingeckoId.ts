export interface CoingeckoId extends String {
  _CoingeckoIdBrand: string
}

export function CoingeckoId(value: string) {
  if (!value) {
    throw new TypeError('CoingeckoId cannot be empty string')
  }
  return value as unknown as CoingeckoId
}
