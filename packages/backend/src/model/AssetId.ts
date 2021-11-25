export interface AssetId extends String {
  _AssetIdBrand: string
}

export function AssetId(value: string) {
  if (value === '') {
    throw new TypeError('Invalid AssetId')
  }
  return value as unknown as AssetId
}
