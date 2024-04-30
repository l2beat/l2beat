import { AmountConfigEntry, assertUnreachable } from '@l2beat/shared-pure'
import { createHash } from 'crypto'

export function createAmountId(amountConfig: AmountConfigEntry): string {
  const input = []

  input.push(amountConfig.chain)
  input.push(amountConfig.project.toString())
  input.push(amountConfig.type)
  // sinceTimestamp is not used in the ID calculation.
  // untilTimestamp is not used in the ID calculation.
  // includeInTotal is not used in the ID calculation.
  // decimals is not used in the ID calculation.

  switch (amountConfig.type) {
    case 'totalSupply':
      input.push(amountConfig.address.toString())
      break
    case 'circulatingSupply':
      input.push(amountConfig.address.toString())
      input.push(amountConfig.coingeckoId.toString())
      break
    case 'escrow':
      input.push(amountConfig.address.toString())
      input.push(amountConfig.escrowAddress.toString())
      break
    default:
      assertUnreachable(amountConfig)
  }

  const hash = createHash('sha1').update(input.join('')).digest('hex')
  return hash.slice(0, 12)
}
