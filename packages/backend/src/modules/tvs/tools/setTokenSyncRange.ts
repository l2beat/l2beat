import type {
  AmountFormula,
  CalculationFormula,
  TvsToken,
  ValueFormula,
} from '@l2beat/config'

/**
 * Overwrites sync range for a token
 * @param token Token
 * @returns sync range
 */
export function setTokenSyncRange(
  token: TvsToken,
  syncRange: { sinceTimestamp?: number; untilTimestamp?: number },
) {
  const setSyncRangeRecursive = (
    formula: CalculationFormula | ValueFormula | AmountFormula | undefined,
  ) => {
    if (!formula) {
      return
    }

    if (formula.type === 'calculation') {
      for (const arg of formula.arguments) {
        setSyncRangeRecursive(arg)
      }
    } else if (formula.type === 'value') {
      setSyncRangeRecursive(formula.amount)
    } else {
      if (
        syncRange.sinceTimestamp &&
        syncRange.sinceTimestamp > formula.sinceTimestamp
      ) {
        formula.sinceTimestamp = syncRange.sinceTimestamp
      }

      if (
        syncRange.untilTimestamp &&
        (!formula.untilTimestamp ||
          syncRange.untilTimestamp < formula.untilTimestamp)
      ) {
        formula.untilTimestamp = syncRange.untilTimestamp
      }
    }
  }

  setSyncRangeRecursive(token.amount)
  setSyncRangeRecursive(token.valueForProject)
  setSyncRangeRecursive(token.valueForSummary)
}
