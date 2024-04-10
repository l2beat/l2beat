import {
  assertUnreachable,
  CirculatingSupplySpecific,
  EscrowSpecific,
  ProjectId,
  TotalSupplySpecific,
} from '@l2beat/shared-pure'
import { createHash } from 'crypto'

export function createAmountId(
  chain: string,
  projectId: ProjectId,
  typeSpecific:
    | TotalSupplySpecific
    | CirculatingSupplySpecific
    | EscrowSpecific,
): string {
  let typeSpecificPart: string
  switch (typeSpecific.type) {
    case 'totalSupply':
      typeSpecificPart = `totalSupply-${typeSpecific.address.toString()}`
      break
    case 'circulatingSupply':
      typeSpecificPart = `circulatingSupply-${typeSpecific.address.toString()}-${typeSpecific.coingeckoId.toString()}`
      break
    case 'escrow':
      typeSpecificPart = `escrow-${typeSpecific.address.toString()}-${typeSpecific.escrowAddress.toString()}`
      break
    default:
      assertUnreachable(typeSpecific)
  }

  const fullId = `${projectId}-${chain}-${typeSpecificPart}`
  const hash = createHash('sha1').update(fullId).digest('hex')
  return hash.slice(0, 12)
}
