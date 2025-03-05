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
        const amount = await this.executeFormula(token.amount, timestamp)
        const value = await this.executeValueFormula(
          {
            amount: token.amount,
            priceId: token.priceId,
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
          tokenConfig: token,
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
    if (formula.type === 'const') {
      return formula.value
    }

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
    const price = await this.storage.getPrice(priceConfig.priceId, timestamp)
    assert(price !== undefined, `Price not found for ${priceConfig.priceId}`)

    const amount = await this.executeFormula(formula.amount, timestamp)
    const value = amount * price
    return value
  }

  private async executeFormula(
    formula: CalculationFormula | ValueFormula | AmountFormula,
    timestamp: UnixTime,
  ): Promise<number> {
    const executeFormulaRecursive = async (
      formula: CalculationFormula | ValueFormula | AmountFormula,
      timestamp: UnixTime,
    ): Promise<number> => {
      if (formula.type === 'value') {
        return await this.executeValueFormula(formula, timestamp)
      }

      if (formula.type === 'calculation') {
        return await formula.arguments.reduce(
          async (
            acc: Promise<number>,
            current: CalculationFormula | ValueFormula | AmountFormula,
            index: number,
          ) => {
            const valueAcc = await acc
            const value = await executeFormulaRecursive(current, timestamp)

            switch (formula.operator) {
              case 'sum':
                return valueAcc + value
              case 'diff':
                return index === 0 ? value : valueAcc - value
              case 'max':
                return Math.max(valueAcc, value)
              case 'min':
                return Math.min(valueAcc, value)
            }
          },
          Promise.resolve(formula.operator === 'min' ? Infinity : 0),
        )
      }

      return await this.executeAmountFormula(formula, timestamp)
    }

    return await executeFormulaRecursive(formula, timestamp)
  }
}
