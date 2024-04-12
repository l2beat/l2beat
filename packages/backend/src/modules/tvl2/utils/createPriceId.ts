import { assertUnreachable, PriceConfigEntry } from '@l2beat/shared-pure'
import { createHash } from 'crypto'

export function createPriceId(priceConfig: PriceConfigEntry): string {
  let typeSpecificPart: string
  switch (priceConfig.type) {
    case 'coingecko':
      typeSpecificPart = `coingecko-${priceConfig.coingeckoId.toString()}`
      break

    default:
      assertUnreachable(priceConfig.type)
  }

  const fullId = `${
    priceConfig.chain
  }-${priceConfig.address.toString()}-${typeSpecificPart}`
  const hash = createHash('sha1').update(fullId).digest('hex')
  return hash.slice(0, 12)
}
