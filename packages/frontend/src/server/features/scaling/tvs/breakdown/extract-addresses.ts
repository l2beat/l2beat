import type { Formula } from '@l2beat/config'

import type {
  AmountFormula,
  CalculationFormula,
  TvsToken,
  ValueFormula,
} from '@l2beat/config'
import { type EthereumAddress, assertUnreachable } from '@l2beat/shared-pure'
import { uniqBy } from 'lodash'

export type Address = {
  address: EthereumAddress
  chain: string
}

export function extractAddresses(token: TvsToken): {
  addresses: Address[]
  escrows: Address[]
} {
  if (!token.amount) return { addresses: [], escrows: [] }

  const addresses: Address[] = []
  const escrows: Address[] = []

  function collectFromFormula(
    formula: CalculationFormula | ValueFormula | AmountFormula,
  ) {
    switch (formula.type) {
      case 'calculation':
        formula.arguments.forEach((arg) => collectFromFormula(arg))
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
  }

  collectFromFormula(token.amount as Formula)

  return {
    addresses: uniqBy(addresses, 'address'),
    escrows: uniqBy(escrows, 'address'),
  }
}
