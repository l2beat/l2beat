import { createHash } from 'crypto'
import { AmountConfigEntry, PriceConfigEntry } from '@l2beat/shared-pure'
import { createAmountId } from './createAmountId'
import { createPriceId } from './createPriceId'

export type ValueId = string

export function createValueId(
  amountConfig: AmountConfigEntry,
  priceId: PriceConfigEntry,
): ValueId {
  const input = []

  input.push(createAmountId(amountConfig))
  input.push(createPriceId(priceId))
  input.push(amountConfig.source)
  input.push(amountConfig.includeInTotal)
  input.push(amountConfig.decimals)

  const hash = createHash('sha1').update(input.join('')).digest('hex')
  return hash.slice(0, 12)
}
