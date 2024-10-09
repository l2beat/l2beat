import { createHash } from 'crypto'
import { createAmountId } from '@l2beat/config'
import {
  assert,
  AmountConfigEntry,
  CoingeckoPriceConfigEntry,
} from '@l2beat/shared-pure'
import { createValueId } from './createValueId'

export function getValuesConfigHash(
  amountConfigs: AmountConfigEntry[],
  priceConfigs: CoingeckoPriceConfigEntry[],
): string {
  const valueIds: string[] = []

  for (const amount of amountConfigs) {
    const price = priceConfigs.find((p) => p.assetId === amount.assetId)
    assert(price, `Price config not found for ${createAmountId(amount)}`)
    const valueId = createValueId(amount, price)
    valueIds.push(valueId)
  }

  // Hash should not change if order of tokens changes
  const sortedInput = valueIds.sort((a, b) => a.localeCompare(b))

  const hash = createHash('sha1').update(sortedInput.join('')).digest('hex')
  return hash.slice(0, 12)
}
