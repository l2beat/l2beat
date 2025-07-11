import type {
  AmountFormula,
  CalculationFormula,
  TvsToken,
  ValueFormula,
} from '@l2beat/config'

/**
 * Calculates the sync range for a token
 * @param token Token
 * @returns sync range
 */
export function getTokenSyncRange(token: TvsToken): {
  sinceTimestamp: number
  untilTimestamp: number | undefined
} {
  let sinceTimestamp: number = Number.POSITIVE_INFINITY
  let untilTimestamp: number | undefined = -1

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
  getSyncRangeRecursive(token.valueForSummary)

  return { sinceTimestamp, untilTimestamp }
}

/**
 * Checks if timestamp is in sync range for the given token
 * @param token token
 * @param timestamp timestamp to check
 * @returns result
 */
export function isInTokenSyncRange(token: TvsToken, timestamp: number) {
  const { sinceTimestamp, untilTimestamp } = getTokenSyncRange(token)
  return (
    timestamp >= sinceTimestamp &&
    (untilTimestamp === undefined || timestamp <= untilTimestamp)
  )
}
