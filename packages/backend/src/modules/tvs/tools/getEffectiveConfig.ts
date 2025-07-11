import type {
  AmountFormula,
  CalculationFormula,
  TvsToken,
  ValueFormula,
} from '@l2beat/config'

/**
 * Function used to filter out configurations that end before given timestamp.
 *
 * @param tokens
 * "raw" tvs tokens configuration
 * @param timestamp
 * up until which point to filter out configurations
 * @param includeStartingInFuture
 * should the script also return configurations with sinceTimestamp after given timestamp
 * @returns
 */

export function getEffectiveConfig(
  tokens: TvsToken[],
  timestamp: number,
  includeStartingInFuture = true,
): TvsToken[] {
  const tokensInRange = []

  for (const token of tokens) {
    const amountInRange = isInRangeRecursive(
      token.amount,
      timestamp,
      includeStartingInFuture,
    )

    if (!amountInRange) {
      continue
    }

    if (token.valueForProject) {
      token.valueForProject = isInRangeRecursive(
        token.valueForProject,
        timestamp,
        includeStartingInFuture,
      )
        ? token.valueForProject
        : undefined
    }

    if (token.valueForSummary) {
      token.valueForSummary = isInRangeRecursive(
        token.valueForSummary,
        timestamp,
        includeStartingInFuture,
      )
        ? token.valueForSummary
        : undefined
    }

    tokensInRange.push(token)
  }

  return tokensInRange
}

function isInRangeRecursive(
  formula: CalculationFormula | ValueFormula | AmountFormula,
  timestamp: number,
  includeStartingInFuture: boolean,
): boolean {
  if (formula.type === 'calculation') {
    const argumentsInRange = []
    for (const arg of formula.arguments) {
      const inRange = isInRangeRecursive(
        arg,
        timestamp,
        includeStartingInFuture,
      )
      if (inRange) {
        argumentsInRange.push(arg)
      }
    }

    formula.arguments = argumentsInRange

    // for diff we need at least 2 arguments for other operators we need at least 1
    return formula.operator === 'diff'
      ? argumentsInRange.length >= 2
      : argumentsInRange.length >= 1
  }
  if (formula.type === 'value') {
    return isInRangeRecursive(
      formula.amount,
      timestamp,
      includeStartingInFuture,
    )
  }
  if (formula.untilTimestamp && formula.untilTimestamp <= timestamp) {
    return false
  }

  if (!includeStartingInFuture && formula.sinceTimestamp >= timestamp) {
    return false
  }

  if (formula.sinceTimestamp < timestamp) {
    formula.sinceTimestamp = timestamp
  }

  return true
}
