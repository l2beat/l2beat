import {
  AmountConfigIdentifiable,
  assertUnreachable,
} from '@l2beat/shared-pure'
import { createHash } from 'crypto'

export function createAmountId(amountConfig: AmountConfigIdentifiable): string {
  let typeSpecificPart: string
  switch (amountConfig.type) {
    case 'totalSupply':
      typeSpecificPart = `totalSupply-${amountConfig.address.toString()}`
      break
    case 'circulatingSupply':
      typeSpecificPart = `circulatingSupply-${amountConfig.address.toString()}-${amountConfig.coingeckoId.toString()}`
      break
    case 'escrow':
      typeSpecificPart = `escrow-${amountConfig.address.toString()}-${amountConfig.escrowAddress.toString()}`
      break
    default:
      assertUnreachable(amountConfig)
  }

  const fullId = `${amountConfig.project.toString()}-${
    amountConfig.chain
  }-${typeSpecificPart}`
  const hash = createHash('sha1').update(fullId).digest('hex')
  return hash.slice(0, 12)
}
