import { UnixTime } from '@l2beat/shared-pure'

export type PriceRemappingRule = {
  abstractId: string
  fromTimestamp: UnixTime
  priceUsd: number
}

type TokenPriceIdentity = {
  abstractId: string
}

// Populate this list only for manual incident overrides, for example when a
// market feed is temporarily stale after an exploit or depeg.
export const INTEROP_PRICE_REMAPPING_RULES: PriceRemappingRule[] = [
  {
    abstractId: '3ZOZ69', // DOT
    fromTimestamp: UnixTime(1776057650), // ~ 2026-04-13 07:21:23.000000 minus few seconds
    priceUsd: 0,
  },
]

export function getRemappedPrice(
  rules: readonly PriceRemappingRule[],
  token: TokenPriceIdentity,
  timestamp: UnixTime,
): number | undefined {
  for (const rule of rules) {
    if (
      token.abstractId === rule.abstractId &&
      timestamp >= rule.fromTimestamp
    ) {
      return rule.priceUsd
    }
  }
}
