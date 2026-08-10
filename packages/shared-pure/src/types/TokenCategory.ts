export const TOKEN_CATEGORIES = [
  'ether',
  'stablecoin',
  'btc',
  'rwaRestricted',
  'rwaPublic',
  'other',
] as const

export type TokenCategory = (typeof TOKEN_CATEGORIES)[number]
