import type {
  BalanceOfEscrowAmountFormula,
  CalculationFormula,
  StarknetBalanceOfAmountFormula,
  TvsToken,
} from '@l2beat/config'

export type EscrowBalanceFormula =
  | BalanceOfEscrowAmountFormula
  | StarknetBalanceOfAmountFormula

/**
 * Escrow balances whose sum is the token's amount, so each escrow's value is
 * its share of the token value. Empty for any other formula, and for a single
 * escrow, whose value is the token value itself.
 */
export function getSummedEscrowBalances(
  token: TvsToken,
): EscrowBalanceFormula[] {
  if (token.amount.type !== 'calculation') return []
  const balances = getEscrowBalances(token.amount)
  return balances && balances.length > 1 ? balances : []
}

function getEscrowBalances(
  formula: CalculationFormula | TvsToken['amount'],
): EscrowBalanceFormula[] | undefined {
  if (
    formula.type === 'balanceOfEscrow' ||
    formula.type === 'starknetBalanceOf'
  ) {
    return [formula]
  }
  if (formula.type !== 'calculation' || formula.operator !== 'sum') {
    return undefined
  }
  const balances: EscrowBalanceFormula[] = []
  for (const argument of formula.arguments) {
    if (argument.type === 'value') return undefined
    const nested = getEscrowBalances(argument)
    if (!nested) return undefined
    balances.push(...nested)
  }
  return balances
}
