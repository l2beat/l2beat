import type { Formula } from '@l2beat/config'
import { type TokenRef, toTokenRef } from './tokens'

export interface FormulaLeaf extends TokenRef {
  escrowAddresses: string[]
}

type LeafFormula = Exclude<Formula, { type: 'calculation' | 'value' | 'const' }>

/**
 * Deployments a formula counts at `timestamp`. Follows the TVS runtime: a sum
 * counts its active arguments, and a diff counts its minuend while the
 * subtrahends only lower the amount.
 */
export function collectActiveLeaves(
  formula: Formula,
  timestamp: number,
): FormulaLeaf[] {
  return activeLeaves(formula, timestamp) ?? []
}

/** Deployments a formula counts only from a timestamp after `timestamp`. */
export function collectScheduledLeaves(
  formula: Formula,
  timestamp: number,
): FormulaLeaf[] {
  switch (formula.type) {
    case 'calculation':
      return countedArguments(formula).flatMap((argument) =>
        collectScheduledLeaves(argument, timestamp),
      )
    case 'value':
      return collectScheduledLeaves(formula.amount, timestamp)
    case 'const':
      return []
    default:
      return formula.sinceTimestamp >= timestamp ? [toLeaf(formula)] : []
  }
}

// `undefined` means the formula has no value at `timestamp`, unlike an active
// formula without leaves, such as a constant.
function activeLeaves(
  formula: Formula,
  timestamp: number,
): FormulaLeaf[] | undefined {
  switch (formula.type) {
    case 'calculation': {
      const active = countedArguments(formula)
        .map((argument) => activeLeaves(argument, timestamp))
        .filter((leaves) => leaves !== undefined)
      return active.length > 0 ? active.flat() : undefined
    }
    case 'value':
      return activeLeaves(formula.amount, timestamp)
    case 'const':
      return isActiveAt(formula, timestamp) ? [] : undefined
    default:
      return isActiveAt(formula, timestamp) ? [toLeaf(formula)] : undefined
  }
}

function countedArguments(
  formula: Extract<Formula, { type: 'calculation' }>,
): Formula[] {
  return formula.operator === 'diff'
    ? formula.arguments.slice(0, 1)
    : formula.arguments
}

function toLeaf(formula: LeafFormula): FormulaLeaf {
  return {
    ...toTokenRef(formula.chain, formula.address),
    escrowAddresses: getEscrowAddresses(formula).map((address) =>
      address.toLowerCase(),
    ),
  }
}

function getEscrowAddresses(formula: LeafFormula): string[] {
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

function isActiveAt(
  formula: { sinceTimestamp: number; untilTimestamp?: number },
  timestamp: number,
): boolean {
  return (
    formula.sinceTimestamp < timestamp &&
    (formula.untilTimestamp === undefined || formula.untilTimestamp > timestamp)
  )
}
