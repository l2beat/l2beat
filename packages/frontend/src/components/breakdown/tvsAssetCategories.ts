/** Asset category names in the order of the HTML "Tokens breakdown" tooltip, shared by everything that names them. */
export const TVS_ASSET_CATEGORY_LABELS = {
  ether: 'ETH & derivatives',
  stablecoin: 'Stablecoins',
  btc: 'BTC & derivatives',
  other: 'Other',
  rwaPublic: 'Public RWAs',
  rwaRestricted: 'Restricted RWAs',
} as const

export type TvsAssetCategory = keyof typeof TVS_ASSET_CATEGORY_LABELS

export const TVS_ASSET_CATEGORIES = Object.keys(
  TVS_ASSET_CATEGORY_LABELS,
) as TvsAssetCategory[]
