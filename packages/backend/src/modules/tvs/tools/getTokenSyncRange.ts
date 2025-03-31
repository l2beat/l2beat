import type {
  AmountFormula,
  CalculationFormula,
  TvsToken,
  ValueFormula,
} from '@l2beat/config'

export function getTokenSyncRange(token: TvsToken): {
  sinceTimestamp: number
  untilTimestamp: number | undefined
} {
  let sinceTimestamp: number = Infinity
  let untilTimestamp: number | undefined = undefined

  const getSyncRangeRecursive = (
    formula: CalculationFormula | ValueFormula | AmountFormula | undefined,
  ) => {
    if (!formula) {
      return
    }

    if (formula.type === 'calculation') {
      for (const arg of formula.arguments) {
        getSyncRangeRecursive(arg)
      }
    } else if (formula.type === 'value') {
      getSyncRangeRecursive(formula.amount)
    } else {
      if (formula.sinceTimestamp < sinceTimestamp) {
        sinceTimestamp = formula.sinceTimestamp
      }

      if (untilTimestamp && formula.untilTimestamp) {
        untilTimestamp = Math.max(untilTimestamp, formula.untilTimestamp)
      } else {
        untilTimestamp = undefined
      }
    }
  }

  getSyncRangeRecursive(token.amount)
  getSyncRangeRecursive(token.valueForProject)
  getSyncRangeRecursive(token.valueForTotal)

  return { sinceTimestamp, untilTimestamp }
}
