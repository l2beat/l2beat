import { assert, type UnixTime } from '@l2beat/shared-pure'
import type { DataStorage } from './DataStorage'
import { createAmountConfig, createPriceConfig } from './mapConfig'
import type {
  AmountFormula,
  CalculationFormula,
  TokenValue,
  TvsConfig,
  ValueFormula,
} from './types'

export class ValueService {
  constructor(private readonly storage: DataStorage) {}

  async calculate(
    config: TvsConfig,
    timestamps: UnixTime[],
  ): Promise<Map<number, TokenValue[]>> {
    const result = new Map<number, TokenValue[]>()

    for (const timestamp of timestamps) {
      const values: TokenValue[] = []

      for (const token of config.tokens) {
        const amount = await this.executeAmountFormula(token.amount, timestamp)
        const value = await this.executeValueFormula(
          {
            amount: token.amount,
            ticker: token.ticker,
          } as ValueFormula,
          timestamp,
        )

        const valueForProject = token.valueForProject
          ? await this.executeFormula(token.valueForProject, timestamp)
          : value

        const valueForTotal = token.valueForTotal
          ? await this.executeFormula(token.valueForTotal, timestamp)
          : (valueForProject ?? value)

        values.push({
          tokenId: token.id,
          projectId: config.projectId,
          amount,
          value,
          valueForProject,
          valueForTotal,
        })
      }

      result.set(timestamp.toNumber(), values)
    }

    return await Promise.resolve(result)
  }

  private async executeAmountFormula(
    formula: AmountFormula,
    timestamp: UnixTime,
  ): Promise<number> {
    const config = createAmountConfig(formula)
    const amount = await this.storage.getAmount(config.id, timestamp)
    assert(amount !== undefined, `${formula.type} ${config.id}`)
    return amount
  }

  private async executeValueFormula(
    formula: ValueFormula,
    timestamp: UnixTime,
  ): Promise<number> {
    const priceConfig = createPriceConfig(formula)
    const price = await this.storage.getPrice(priceConfig.ticker, timestamp)
    assert(price !== undefined, `Price not found for ${priceConfig.ticker}`)

    const amount = await this.executeAmountFormula(formula.amount, timestamp)
    const value = amount * price
    return value
  }

  private async executeFormula(
    formula: CalculationFormula | ValueFormula,
    timestamp: UnixTime,
  ): Promise<number> {
    const executeFormulaRecursive = async (
      formula: CalculationFormula | ValueFormula,
      timestamp: UnixTime,
    ): Promise<number> => {
      if (formula.type === 'value') {
        return await this.executeValueFormula(formula, timestamp)
      }

      return await formula.arguments.reduce(
        async (
          acc: Promise<number>,
          current: CalculationFormula | ValueFormula,
          index: number,
        ) => {
          const valueAcc = await acc
          const value = await executeFormulaRecursive(current, timestamp)

          if (formula.operator === 'sum') {
            return Promise.resolve(valueAcc + value)
          } else {
            return Promise.resolve(index === 0 ? value : valueAcc - value)
          }
        },
        Promise.resolve(0),
      )
    }

    return await executeFormulaRecursive(formula, timestamp)
  }
}
