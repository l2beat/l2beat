import type {
  AmountFormula,
  BalanceOfEscrowAmountFormula,
  CalculationFormula,
  CirculatingSupplyAmountFormula,
  ConstAmountFormula,
  StarknetTotalSupplyAmountFormula,
  TotalSupplyAmountFormula,
  TvsToken,
  ValueFormula,
} from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import { createHash } from 'crypto'
import type { AmountConfig, PriceConfig } from '../types'

export function extractPricesAndAmounts(tokens: TvsToken[]) {
  const amounts = new Map<string, AmountConfig>()
  const prices = new Map<string, PriceConfig>()

  for (const token of tokens) {
    if (token.amount.type === 'calculation') {
      const { formulaAmounts, formulaPrices } = processFormulaRecursive(
        token.amount,
      )
      formulaAmounts.forEach((a) => setAmount(amounts, a))

      assert(
        formulaPrices.length === 0,
        'Amount formula should not have any prices',
      )

      const { sinceTimestamp, untilTimestamp } = getPriceRange(formulaAmounts)

      setPrice(prices, {
        id: createPriceConfigId(token.priceId),
        sinceTimestamp,
        untilTimestamp,
        priceId: token.priceId,
      })
    } else {
      const amount = createAmountConfig(token.amount)
      setAmount(amounts, amount)

      setPrice(prices, {
        id: createPriceConfigId(token.priceId),
        sinceTimestamp: amount.sinceTimestamp,
        untilTimestamp: amount.untilTimestamp,
        priceId: token.priceId,
      })
    }

    if (token.valueForProject) {
      const { formulaAmounts, formulaPrices } = processFormulaRecursive(
        token.valueForProject,
      )
      formulaAmounts.forEach((a) => setAmount(amounts, a))
      formulaPrices.forEach((p) => setPrice(prices, p))
    }

    if (token.valueForSummary) {
      const { formulaAmounts, formulaPrices } = processFormulaRecursive(
        token.valueForSummary,
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

    const { sinceTimestamp, untilTimestamp } = getPriceRange(formulaAmounts)

    formulaPrices.push({
      id: createPriceConfigId(formula.priceId),
      sinceTimestamp,
      untilTimestamp,
      priceId: formula.priceId,
    })
  } else {
    const amount = createAmountConfig(formula)
    formulaAmounts.push(amount)
  }

  return { formulaAmounts, formulaPrices }
}

function setPrice(prices: Map<string, PriceConfig>, priceToAdd: PriceConfig) {
  const existingPrice = prices.get(priceToAdd.id)
  if (!existingPrice) {
    prices.set(priceToAdd.id, priceToAdd)
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

  prices.set(mergedPrice.id, mergedPrice)
}

function setAmount(
  amounts: Map<string, AmountConfig>,
  amountToAdd: AmountConfig,
) {
  if (amountToAdd.type === 'const') {
    return
  }

  const existingAmount = amounts.get(amountToAdd.id)
  if (!existingAmount) {
    amounts.set(amountToAdd.id, amountToAdd)
    return
  }

  const mergedAmount: AmountConfig = {
    ...existingAmount,
    sinceTimestamp: Math.min(
      amountToAdd.sinceTimestamp,
      existingAmount.sinceTimestamp,
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
    | StarknetTotalSupplyAmountFormula
    | CirculatingSupplyAmountFormula
    | ConstAmountFormula,
): AmountConfig {
  switch (formula.type) {
    case 'balanceOfEscrow':
      return {
        id: generateConfigurationId([
          formula.type,
          formula.address,
          formula.chain,
          formula.decimals.toString(),
          formula.escrowAddress,
        ]),
        ...formula,
      }
    case 'starknetTotalSupply':
    case 'totalSupply':
      return {
        id: generateConfigurationId([
          formula.type,
          formula.address,
          formula.chain,
          formula.decimals.toString(),
        ]),
        ...formula,
      }
    case 'circulatingSupply':
      return {
        id: generateConfigurationId([formula.type, formula.apiId]),
        ...formula,
      }
    // we need to create config to be able to deduce sync range for related price config
    case 'const':
      return {
        id: 'const',
        ...formula,
      }
  }
}

export function generateConfigurationId(input: string[]): string {
  const hash = createHash('sha1').update(input.join('')).digest('hex')
  return hash.slice(0, 12)
}

export function createPriceConfigId(priceId: string): string {
  return generateConfigurationId([`price_${priceId}`])
}

function getPriceRange(formulaAmounts: AmountConfig[]) {
  const sinceTimestamp = Math.min(
    ...formulaAmounts.map((a) => a.sinceTimestamp),
  )

  const untilTimestamps = formulaAmounts.map((a) => a.untilTimestamp ?? -1)
  const maxUntilTimestamp = Math.max(...untilTimestamps)
  const untilTimestamp =
    maxUntilTimestamp === -1 ? undefined : maxUntilTimestamp

  return { sinceTimestamp, untilTimestamp }
}
