import type {
  AmountFormula,
  CalculationFormula,
  Token,
  ValueFormula,
} from '../types'

export function getEffectiveConfig(
  tokens: Token[],
  timestamp: number,
): Token[] {
  const tokensInRange = []

  for (const token of tokens) {
    const amountInRange = processFormulaRecursive(token.amount, timestamp)

    // if amount formula  is not in range we skip the token
    if (!amountInRange) {
      continue
    }

    // if valueForProject or valueForTotal is not in range we set it to undefined
    if (token.valueForProject) {
      token.valueForProject = processFormulaRecursive(
        token.valueForProject,
        timestamp,
      )
        ? token.valueForProject
        : undefined
    }

    if (token.valueForTotal) {
      token.valueForTotal = processFormulaRecursive(
        token.valueForTotal,
        timestamp,
      )
        ? token.valueForTotal
        : undefined
    }

    tokensInRange.push(token)
  }

  return tokensInRange
}

function processFormulaRecursive(
  formula: CalculationFormula | ValueFormula | AmountFormula,
  timestamp: number,
): boolean {
  if (formula.type === 'calculation') {
    const argumentsInRange = []
    for (const arg of formula.arguments) {
      const inRange = processFormulaRecursive(arg, timestamp)
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
    return processFormulaRecursive(formula.amount, timestamp)
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
