export type AssetType = 'CBV' | 'EBV' | 'NMV'

export function isAssetType(value: string): value is AssetType {
  return value === 'CBV' || value === 'EBV' || value === 'NMV'
}

export function AssetType(value: string): AssetType {
  if (!isAssetType(value)) {
    throw new Error(`Invalid asset type: ${value}`)
  }
  return value
}
