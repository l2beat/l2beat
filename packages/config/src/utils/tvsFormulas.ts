import type { AmountFormula, Formula, ValueFormula } from '../types'

/**
 * Every amount formula a formula reads, depth first, including the
 * subtrahends of a diff. The TVS indexers sync all of them.
 */
export function getAmountFormulas(formula: Formula): AmountFormula[] {
  switch (formula.type) {
    case 'calculation':
      return formula.arguments.flatMap(getAmountFormulas)
    case 'value':
      return getAmountFormulas(formula.amount)
    default:
      return [formula]
  }
}

/**
 * Amount formulas TVS counts, depth first. A diff counts its minuend, while
 * its subtrahends only lower the amount. Other operators count every argument.
 */
export function getCountedAmountFormulas(formula: Formula): AmountFormula[] {
  switch (formula.type) {
    case 'calculation': {
      const counted =
        formula.operator === 'diff'
          ? formula.arguments.slice(0, 1)
          : formula.arguments
      return counted.flatMap(getCountedAmountFormulas)
    }
    case 'value':
      return getCountedAmountFormulas(formula.amount)
    default:
      return [formula]
  }
}

/** Value formulas a formula prices, depth first. */
export function getValueFormulas(formula: Formula): ValueFormula[] {
  switch (formula.type) {
    case 'calculation':
      return formula.arguments.flatMap(getValueFormulas)
    case 'value':
      return [formula]
    default:
      return []
  }
}

/**
 * Whether TVS reads the amount at `timestamp`: from its sinceTimestamp through
 * its untilTimestamp, both inclusive, the range the amount indexers sync.
 */
export function isAmountFormulaActive(
  formula: AmountFormula,
  timestamp: number,
): boolean {
  return (
    formula.sinceTimestamp <= timestamp &&
    (formula.untilTimestamp === undefined ||
      timestamp <= formula.untilTimestamp)
  )
}

/** Escrows whose balance an amount formula reads. */
export function getEscrowAddresses(formula: AmountFormula): string[] {
  switch (formula.type) {
    case 'balanceOfEscrows':
      return formula.escrowAddresses
    case 'balanceOfEscrow':
    case 'starknetBalanceOf':
      return [formula.escrowAddress]
    default:
      return []
  }
}
