import type { AmountFormula, Formula } from '@l2beat/config'
import {
  getCountedAmountFormulas,
  getEscrowAddresses,
  isAmountFormulaActive,
} from '@l2beat/config/build/utils/tvsFormulas'
import { type TokenRef, toTokenRef } from './tokens'

export interface FormulaLeaf extends TokenRef {
  escrowAddresses: string[]
}

/** Deployments a formula counts at `timestamp`, as the TVS runtime does. */
export function collectActiveLeaves(
  formula: Formula,
  timestamp: number,
): FormulaLeaf[] {
  return countedDeployments(formula)
    .filter((amount) => isAmountFormulaActive(amount, timestamp))
    .map(toLeaf)
}

/** Deployments a formula counts only from a timestamp after `timestamp`. */
export function collectScheduledLeaves(
  formula: Formula,
  timestamp: number,
): FormulaLeaf[] {
  return countedDeployments(formula)
    .filter((amount) => amount.sinceTimestamp > timestamp)
    .map(toLeaf)
}

function countedDeployments(formula: Formula) {
  return getCountedAmountFormulas(formula).filter(
    (amount) => amount.type !== 'const',
  )
}

function toLeaf(
  amount: Exclude<AmountFormula, { type: 'const' }>,
): FormulaLeaf {
  return {
    ...toTokenRef(amount.chain, amount.address),
    escrowAddresses: getEscrowAddresses(amount).map((address) =>
      address.toLowerCase(),
    ),
  }
}
