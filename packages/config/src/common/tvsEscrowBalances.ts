import type {
  BalanceOfEscrowAmountFormula,
  CalculationFormula,
  StarknetBalanceOfAmountFormula,
  TvsToken,
} from '../types'

export type EscrowBalanceFormula =
  | BalanceOfEscrowAmountFormula
  | StarknetBalanceOfAmountFormula

/**
 * The escrow balances a token's amount is made of: one balance, or a sum of
 * them. Undefined for any other formula, whose value can't be split by escrow.
 */
export function getEscrowBalances(
  token: Pick<TvsToken, 'amount'>,
): EscrowBalanceFormula[] | undefined {
  return collect(token.amount)
}

/**
 * Escrow balances whose sum is the token's amount, so each escrow's value is
 * its share of the token value: the TVS backend stores it for privacy
 * projects. Empty for any other formula, and for a single escrow, whose value
 * is the token value itself.
 */
export function getSummedEscrowBalances(
  token: Pick<TvsToken, 'amount'>,
): EscrowBalanceFormula[] {
  const balances = getEscrowBalances(token)
  return balances && balances.length > 1 ? balances : []
}

function collect(
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
    const nested = collect(argument)
    if (!nested) return undefined
    balances.push(...nested)
  }
  return balances
}
