export type CoingeckoId = string & {
  _CoingeckoIdBrand: string
}

export function CoingeckoId(value: string) {
  if (!value) {
    throw new TypeError('CoingeckoId cannot be empty string')
  }
  return value as unknown as CoingeckoId
}
