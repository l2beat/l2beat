import type { Formula } from '@l2beat/config'

import type {
  AmountFormula,
  CalculationFormula,
  TvsToken,
  ValueFormula,
} from '@l2beat/config'
import type { EthereumAddress } from '@l2beat/shared-pure'
import { uniqBy } from 'lodash'

export type TokenAddress = {
  address: EthereumAddress
  chain: string
}

export function extractAddresses(token: TvsToken): TokenAddress[] {
  if (!token.amount) return []

  const addresses: TokenAddress[] = []

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
        break
      case 'totalSupply':
        if (formula.address !== 'native') {
          addresses.push({
            address: formula.address,
            chain: formula.chain,
          })
        }
        break
      case 'circulatingSupply':
      case 'const':
      case 'value':
        // These types don't contain addresses
        break
    }
  }

  collectFromFormula(token.amount as Formula)

  return uniqBy(addresses, 'address')
}
