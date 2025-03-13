import { createHash } from 'crypto'
import { assert } from '@l2beat/shared-pure'
import type {
  AmountConfig,
  AmountFormula,
  BalanceOfEscrowAmountFormula,
  CalculationFormula,
  CirculatingSupplyAmountFormula,
  PriceConfig,
  ProjectTvsConfig,
  TotalSupplyAmountFormula,
  ValueFormula,
} from '../types'
import { getTimestampsRange } from './timestamps'

export function extractPricesAndAmounts(config: ProjectTvsConfig): {
  amounts: AmountConfig[]
  prices: PriceConfig[]
} {
  const amounts = new Map<string, AmountConfig>()
  const prices = new Map<string, PriceConfig>()

  for (const token of config.tokens) {
    if (token.amount.type === 'calculation') {
      const { formulaAmounts, formulaPrices } = processFormulaRecursive(
        token.amount,
      )
      formulaAmounts.forEach((a) => setAmount(amounts, a))

      assert(
        formulaPrices.length === 0,
        'Amount formula should not have any prices',
      )

      const amountFormulaRange = getTimestampsRange(
        ...formulaAmounts.map((a) => ({
          sinceTimestamp: a.sinceTimestamp,
          untilTimestamp: a.untilTimestamp,
        })),
      )

      setPrice(prices, {
        priceId: token.priceId,
        sinceTimestamp: amountFormulaRange.sinceTimestamp,
        untilTimestamp: amountFormulaRange.untilTimestamp,
      })
    } else {
      if (token.amount.type !== 'const') {
        const amount = createAmountConfig(token.amount)
        setAmount(amounts, amount)

        setPrice(prices, {
          priceId: token.priceId,
          sinceTimestamp: amount.sinceTimestamp,
          untilTimestamp: amount.untilTimestamp,
        })
      }
    }

    if (token.valueForProject) {
      const { formulaAmounts, formulaPrices } = processFormulaRecursive(
        token.valueForProject,
      )
      formulaAmounts.forEach((a) => setAmount(amounts, a))
      formulaPrices.forEach((p) => setPrice(prices, p))
    }

    if (token.valueForTotal) {
      const { formulaAmounts, formulaPrices } = processFormulaRecursive(
        token.valueForTotal,
      )
      formulaAmounts.forEach((a) => setAmount(amounts, a))
      formulaPrices.forEach((p) => setPrice(prices, p))
    }
  }

  return {
    amounts: Array.from(amounts.values()),
    prices: Array.from(prices.values()),
  }
}

function processFormulaRecursive(
  formula: CalculationFormula | ValueFormula | AmountFormula,
): {
  formulaAmounts: AmountConfig[]
  formulaPrices: PriceConfig[]
} {
  const formulaAmounts: AmountConfig[] = []
  const formulaPrices: PriceConfig[] = []

  if (formula.type === 'calculation') {
    for (const arg of formula.arguments) {
      const {
        formulaAmounts: innerFormulaAmounts,
        formulaPrices: innerFormulaPrices,
      } = processFormulaRecursive(arg)
      formulaAmounts.push(...innerFormulaAmounts)
      formulaPrices.push(...innerFormulaPrices)
    }
  } else if (formula.type === 'value') {
    const {
      formulaAmounts: innerFormulaAmounts,
      formulaPrices: innerFormulaPrices,
    } = processFormulaRecursive(formula.amount)
    formulaAmounts.push(...innerFormulaAmounts)
    formulaPrices.push(...innerFormulaPrices)

    assert(
      formulaPrices.length === 0,
      'Amount formula should not have any prices',
    )

    const amountFormulaRange = getTimestampsRange(
      ...innerFormulaAmounts.map((a) => ({
        sinceTimestamp: a.sinceTimestamp,
        untilTimestamp: a.untilTimestamp,
      })),
    )

    formulaPrices.push({
      priceId: formula.priceId,
      sinceTimestamp: amountFormulaRange.sinceTimestamp,
      untilTimestamp: amountFormulaRange.untilTimestamp,
    })
  } else if (formula.type !== 'const') {
    const amount = createAmountConfig(formula)
    formulaAmounts.push(amount)
  }

  return { formulaAmounts, formulaPrices }
}

function setPrice(prices: Map<string, PriceConfig>, priceToAdd: PriceConfig) {
  const existingPrice = prices.get(priceToAdd.priceId)
  if (!existingPrice) {
    prices.set(priceToAdd.priceId, priceToAdd)
    return
  }

  const mergedPrice: PriceConfig = {
    ...existingPrice,
    sinceTimestamp: Math.min(
      priceToAdd.sinceTimestamp,
      existingPrice.sinceTimestamp,
    ),
  }

  // set untilTimestamp only if both prices have it
  if (priceToAdd.untilTimestamp && existingPrice.untilTimestamp) {
    mergedPrice.untilTimestamp = Math.max(
      priceToAdd.untilTimestamp,
      existingPrice.untilTimestamp,
    )
  } else {
    mergedPrice.untilTimestamp = undefined
  }

  prices.set(mergedPrice.priceId, mergedPrice)
}

function setAmount(
  amounts: Map<string, AmountConfig>,
  amountToAdd: AmountConfig,
) {
  const existingAmount = amounts.get(amountToAdd.id)
  if (!existingAmount) {
    amounts.set(amountToAdd.id, amountToAdd)
    return
  }

  const mergedAmount: AmountConfig = {
    ...existingAmount,
    sinceTimestamp: Math.min(
      amountToAdd.sinceTimestamp,
      amountToAdd.sinceTimestamp,
    ),
  }

  // set untilTimestamp only if both prices have it
  if (amountToAdd.untilTimestamp && existingAmount.untilTimestamp) {
    mergedAmount.untilTimestamp = Math.max(
      amountToAdd.untilTimestamp,
      existingAmount.untilTimestamp,
    )
  } else {
    mergedAmount.untilTimestamp = undefined
  }

  amounts.set(mergedAmount.id, mergedAmount)
}

export function createAmountConfig(
  formula:
    | BalanceOfEscrowAmountFormula
    | TotalSupplyAmountFormula
    | CirculatingSupplyAmountFormula,
): AmountConfig {
  switch (formula.type) {
    case 'balanceOfEscrow':
      return {
        id: hash([
          formula.type,
          formula.address,
          formula.chain,
          formula.decimals.toString(),
          formula.escrowAddress,
        ]),
        ...formula,
      }
    case 'totalSupply':
      return {
        id: hash([
          formula.type,
          formula.address,
          formula.chain,
          formula.decimals.toString(),
        ]),
        ...formula,
      }
    case 'circulatingSupply':
      return {
        id: hash([formula.type, formula.apiId]),
        ...formula,
      }
  }
}

export function hash(input: string[]): string {
  const hash = createHash('sha1').update(input.join('')).digest('hex')
  return hash.slice(0, 12)
}
