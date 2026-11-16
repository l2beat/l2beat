import type {
  BalanceOfEscrowAmountFormula,
  BalanceOfEscrowsAmountFormula,
  CirculatingSupplyAmountFormula,
  ConstAmountFormula,
  StarknetBalanceOfAmountFormula,
  StarknetTotalSupplyAmountFormula,
  TotalSupplyAmountFormula,
  TvsToken,
} from '@l2beat/config'
import {
  getAmountFormulas,
  getValueFormulas,
} from '@l2beat/config/build/utils/tvsFormulas'
import { assert } from '@l2beat/shared-pure'
import { createHash } from 'crypto'
import type { AmountConfig, PriceConfig } from '../types'

export function extractPricesAndAmounts(
  tokens: TvsToken[],
  chainRanges?: Map<
    string,
    { sinceTimestamp: number | undefined; untilTimestamp: number | undefined }
  >,
) {
  const amounts = new Map<string, AmountConfig>()
  const prices = new Map<string, PriceConfig>()

  for (const token of tokens) {
    assertNoPrices(token.amount)
    const tokenAmounts = getAmountFormulas(token.amount).map(createAmountConfig)
    tokenAmounts.forEach((a) => setAmount(amounts, a, chainRanges))
    setPrice(prices, createPriceConfig(token.priceId, tokenAmounts))

    for (const formula of [token.valueForProject, token.valueForSummary]) {
      if (!formula) continue
      getAmountFormulas(formula).forEach((a) =>
        setAmount(amounts, createAmountConfig(a), chainRanges),
      )
      for (const value of getValueFormulas(formula)) {
        assertNoPrices(value.amount)
        const valueAmounts = getAmountFormulas(value.amount).map(
          createAmountConfig,
        )
        setPrice(prices, createPriceConfig(value.priceId, valueAmounts))
      }
    }
  }

  return {
    amounts: Array.from(amounts.values()),
    prices: Array.from(prices.values()),
  }
}

function assertNoPrices(formula: TvsToken['amount']) {
  assert(
    getValueFormulas(formula).length === 0,
    'Amount formula should not have any prices',
  )
}

function createPriceConfig(
  priceId: string,
  amounts: AmountConfig[],
): PriceConfig {
  return {
    id: createPriceConfigId(priceId),
    ...getPriceRange(amounts),
    priceId,
  }
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
  chainRanges:
    | Map<
        string,
        {
          sinceTimestamp: number | undefined
          untilTimestamp: number | undefined
        }
      >
    | undefined,
) {
  if (amountToAdd.type === 'const') {
    return
  }

  const existingAmount = amounts.get(amountToAdd.id)
  if (!existingAmount) {
    if (chainRanges && 'chain' in amountToAdd) {
      clampAmountToChainRange(amountToAdd, chainRanges)
    }
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

  if (chainRanges && 'chain' in mergedAmount) {
    clampAmountToChainRange(mergedAmount, chainRanges)
  }
  amounts.set(mergedAmount.id, mergedAmount)
}

function clampAmountToChainRange(
  amount: Extract<AmountConfig, { chain: string }>,
  chainRanges: Map<
    string,
    {
      sinceTimestamp: number | undefined
      untilTimestamp: number | undefined
    }
  >,
): void {
  const chainRange = chainRanges.get(amount.chain)
  if (!chainRange) return

  if (
    chainRange.sinceTimestamp &&
    amount.sinceTimestamp < chainRange.sinceTimestamp
  ) {
    amount.sinceTimestamp = chainRange.sinceTimestamp
  }

  if (
    chainRange.untilTimestamp &&
    (!amount.untilTimestamp ||
      amount.untilTimestamp > chainRange.untilTimestamp)
  ) {
    amount.untilTimestamp = chainRange.untilTimestamp
  }
}

export function createAmountConfig(
  formula:
    | BalanceOfEscrowAmountFormula
    | BalanceOfEscrowsAmountFormula
    | TotalSupplyAmountFormula
    | StarknetTotalSupplyAmountFormula
    | StarknetBalanceOfAmountFormula
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
    case 'balanceOfEscrows':
      return {
        id: generateConfigurationId([
          formula.type,
          formula.address,
          formula.chain,
          formula.decimals.toString(),
          ...[...formula.escrowAddresses].sort(),
        ]),
        ...formula,
      }
    case 'starknetTotalSupply':
    case 'starknetBalanceOf':
    case 'totalSupply':
      return {
        id: generateConfigurationId([
          formula.type,
          formula.address,
          formula.chain,
          formula.decimals.toString(),
          ...(formula.type === 'starknetBalanceOf'
            ? [formula.escrowAddress]
            : []),
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
