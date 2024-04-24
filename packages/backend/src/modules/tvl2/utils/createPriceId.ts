import { assertUnreachable, PriceConfigEntry } from '@l2beat/shared-pure'
import { createHash } from 'crypto'

export function createPriceId(priceConfig: PriceConfigEntry): string {
  const input = []

  input.push(priceConfig.address.toString())
  input.push(priceConfig.chain)
  // sinceTimestamp is not used in the ID calculation.
  // untilTimestamp is not used in the ID calculation.

  switch (priceConfig.type) {
    case 'coingecko':
      input.push(priceConfig.type)
      input.push(priceConfig.coingeckoId.toString())
      break

    default:
      assertUnreachable(priceConfig.type)
  }

  const hash = createHash('sha1').update(input.join('')).digest('hex')
  return hash.slice(0, 12)
}
