import { type TokenMetaRecord } from '@l2beat/database'

export function getRequiredTokenMeta(tokenMeta: TokenMetaRecord | undefined) {
  if (
    !tokenMeta?.name ||
    !tokenMeta.symbol ||
    !tokenMeta.decimals ||
    !tokenMeta.logoUrl
  ) {
    return undefined
  }

  return {
    ...tokenMeta,
    name: tokenMeta.name,
    symbol: tokenMeta.symbol,
    decimals: tokenMeta.decimals,
    logoUrl: tokenMeta.logoUrl,
  }
}
