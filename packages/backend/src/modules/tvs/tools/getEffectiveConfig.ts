import type {
  AmountFormula,
  CalculationFormula,
  TvsToken,
  ValueFormula,
} from '@l2beat/config'

export function getEffectiveConfig(
  tokens: TvsToken[],
  timestamp: number,
): TvsToken[] {
  const tokensInRange = []

  for (const token of tokens) {
    const amountInRange = isInRangeRecursive(token.amount, timestamp)

    if (!amountInRange) {
      continue
    }

    if (token.valueForProject) {
      token.valueForProject = isInRangeRecursive(
        token.valueForProject,
        timestamp,
      )
        ? token.valueForProject
        : undefined
    }

    if (token.valueForTotal) {
      token.valueForTotal = isInRangeRecursive(token.valueForTotal, timestamp)
        ? token.valueForTotal
        : undefined
    }

    tokensInRange.push(token)
  }

  return tokensInRange
}

function isInRangeRecursive(
  formula: CalculationFormula | ValueFormula | AmountFormula,
  timestamp: number,
): boolean {
  if (formula.type === 'calculation') {
    const argumentsInRange = []
    for (const arg of formula.arguments) {
      const inRange = isInRangeRecursive(arg, timestamp)
      if (inRange) {
        argumentsInRange.push(arg)
      }
    }

    formula.arguments = argumentsInRange

    // for diff we need at least 2 arguments for other operators we need at least 1
    return formula.operator === 'diff'
      ? argumentsInRange.length >= 2
      : argumentsInRange.length >= 1
  } else if (formula.type === 'value') {
    return isInRangeRecursive(formula.amount, timestamp)
  } else {
    if (formula.untilTimestamp && formula.untilTimestamp < timestamp) {
      return false
    }

    if (formula.sinceTimestamp < timestamp) {
      formula.sinceTimestamp = timestamp
    }

    return true
  }
}
