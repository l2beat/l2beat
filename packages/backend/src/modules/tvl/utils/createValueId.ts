import { createHash } from 'crypto'
import { createAmountId, createPriceId } from '@l2beat/backend-shared'
import type { AmountConfigEntry, PriceConfigEntry } from '@l2beat/shared-pure'

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
  input.push(amountConfig.isAssociated)
  input.push(amountConfig.category)

  const hash = createHash('sha1').update(input.join('')).digest('hex')
  return hash.slice(0, 12)
}
