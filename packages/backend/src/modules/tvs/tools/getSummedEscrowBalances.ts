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
 * its share of the token value. A single escrow balance counts as a sum of
 * one, so a token's only pool gets a value too. Empty for any other formula.
 */
export function getSummedEscrowBalances(
  token: TvsToken,
): EscrowBalanceFormula[] {
  return getEscrowBalances(token.amount) ?? []
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
