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

/** Token contract addresses referenced by the token's amount formula. */
export function extractAddressesFromTokenConfig(token: TvsToken): Address[] {
  if (!token.amount) return []

  return uniqBy(collectAddressesFromFormula(token.amount as Formula), 'address')
}

function collectAddressesFromFormula(
  formula: CalculationFormula | ValueFormula | AmountFormula,
): Address[] {
  switch (formula.type) {
    case 'calculation':
      return formula.arguments.flatMap((arg) =>
        collectAddressesFromFormula(arg),
      )
    case 'balanceOfEscrow':
    case 'starknetBalanceOf':
    case 'balanceOfEscrows':
    case 'totalSupply':
    case 'starknetTotalSupply':
    case 'circulatingSupply':
      if (formula.address === 'native') return []
      return [{ address: formula.address, chain: formula.chain }]
    case 'const':
    case 'value':
      // These types don't contain addresses
      return []
    default:
      assertUnreachable(formula)
  }
}
