import { createHash } from 'crypto'
import type { ChainConfig } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import type {
  AmountConfig,
  AmountFormula,
  BalanceOfEscrowAmountFormula,
  CalculationFormula,
  CirculatingSupplyAmountFormula,
  ConstAmountFormula,
  PriceConfig,
  ProjectTvsConfig,
  TotalSupplyAmountFormula,
  ValueFormula,
} from '../types'
import { getTimestampsRange } from './timestamps'

export function extractPricesAndAmounts(
  config: ProjectTvsConfig,
  chainConfigs?: { id: string; chainConfig: ChainConfig }[],
) {
  const amounts = new Map<string, AmountConfig>()
  const prices = new Map<string, PriceConfig>()
  const chains = new Set<string>()

  for (const token of config.tokens) {
    if (token.amount.type === 'calculation') {
      const { formulaAmounts, formulaPrices } = processFormulaRecursive(
        token.amount,
      )
      formulaAmounts.forEach((a) => setAmount(amounts, chains, a))

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
        id: createPriceConfigId(token.priceId),
        sinceTimestamp: amountFormulaRange.sinceTimestamp,
        untilTimestamp: amountFormulaRange.untilTimestamp,
        priceId: token.priceId,
      })
    } else {
      const amount = createAmountConfig(token.amount)
      setAmount(amounts, chains, amount)

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
      formulaAmounts.forEach((a) => setAmount(amounts, chains, a))
      formulaPrices.forEach((p) => setPrice(prices, p))
    }

    if (token.valueForTotal) {
      const { formulaAmounts, formulaPrices } = processFormulaRecursive(
        token.valueForTotal,
      )
      formulaAmounts.forEach((a) => setAmount(amounts, chains, a))
      formulaPrices.forEach((p) => setPrice(prices, p))
    }
  }

  if (!chainConfigs) {
    return {
      amounts: Array.from(amounts.values()),
      prices: Array.from(prices.values()),
    }
  }

  return {
    amounts: Array.from(amounts.values()),
    prices: Array.from(prices.values()),
    chains: Array.from(chains.values()).map((c) => {
      const chain = chainConfigs.find((cc) => cc.id === c)
      assert(chain, `${c}: chainConfig not configured`)
      assert(chain.chainConfig.sinceTimestamp)

      return {
        chainName: c,
        configurationId: hash([`chain_${c}`]),
        sinceTimestamp: chain.chainConfig.sinceTimestamp,
        untilTimestamp: chain.chainConfig.untilTimestamp,
      }
    }),
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
      id: createPriceConfigId(formula.priceId),
      sinceTimestamp: amountFormulaRange.sinceTimestamp,
      untilTimestamp: amountFormulaRange.untilTimestamp,
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
  chains: Set<string>,
  amountToAdd: AmountConfig,
) {
  if (amountToAdd.type === 'const') {
    return
  }

  if (
    amountToAdd.type === 'balanceOfEscrow' ||
    amountToAdd.type === 'totalSupply'
  ) {
    chains.add(amountToAdd.chain)
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
    | CirculatingSupplyAmountFormula
    | ConstAmountFormula,
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
    // we need to create config to be able to deduce sync range for related price config
    case 'const':
      return {
        id: 'const',
        ...formula,
      }
  }
}

export function hash(input: string[]): string {
  const hash = createHash('sha1').update(input.join('')).digest('hex')
  return hash.slice(0, 12)
}

export function createPriceConfigId(priceId: string): string {
  return hash([`price_${priceId}`])
}
