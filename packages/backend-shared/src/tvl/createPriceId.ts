import { createHash } from 'crypto'
import { type PriceConfigEntry, assertUnreachable } from '@l2beat/shared-pure'

export type PriceId = string

export function createPriceId(priceConfig: PriceConfigEntry): PriceId {
  const input = []

  input.push(priceConfig.address.toString())
  input.push(priceConfig.chain)
  input.push(priceConfig.type)
  // sinceTimestamp is not used in the ID calculation.
  // untilTimestamp is not used in the ID calculation.

  switch (priceConfig.type) {
    case 'coingecko':
      input.push(priceConfig.coingeckoId.toString())
      break

    default:
      assertUnreachable(priceConfig.type)
  }

  const hash = createHash('sha1').update(input.join('')).digest('hex')
  return hash.slice(0, 12)
}
