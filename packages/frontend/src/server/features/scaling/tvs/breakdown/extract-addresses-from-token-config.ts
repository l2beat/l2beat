import type {
  AmountFormula,
  CalculationFormula,
  Formula,
  TvsToken,
  ValueFormula,
} from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'
import uniqBy from 'lodash/uniqBy'

export type Address = {
  address: string
  chain: string
}

export function extractAddressesFromTokenConfig(token: TvsToken): {
  addresses: Address[]
  escrows: Address[]
} {
  if (!token.amount) return { addresses: [], escrows: [] }

  const result = collectAddressesFromFormula(token.amount as Formula)

  return {
    addresses: uniqBy(result.addresses, 'address'),
    escrows: uniqBy(result.escrows, 'address'),
  }
}

function collectAddressesFromFormula(
  formula: CalculationFormula | ValueFormula | AmountFormula,
): { addresses: Address[]; escrows: Address[] } {
  const addresses: Address[] = []
  const escrows: Address[] = []

  switch (formula.type) {
    case 'calculation':
      formula.arguments.forEach((arg) => {
        const result = collectAddressesFromFormula(arg)
        addresses.push(...result.addresses)
        escrows.push(...result.escrows)
      })
      break
    case 'balanceOfEscrow':
      if (formula.address !== 'native') {
        addresses.push({
          address: formula.address,
          chain: formula.chain,
        })
      }
      escrows.push({
        address: formula.escrowAddress,
        chain: formula.chain,
      })
      break
    case 'totalSupply':
    case 'starknetTotalSupply':
    case 'circulatingSupply':
      if (formula.address !== 'native') {
        addresses.push({
          address: formula.address,
          chain: formula.chain,
        })
      }
      break
    case 'const':
    case 'value':
      // These types don't contain addresses
      break
    default:
      assertUnreachable(formula)
  }

  return { addresses, escrows }
}
