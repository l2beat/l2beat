import { assert, type UnixTime } from '@l2beat/shared-pure'
import type { DataStorage } from '../tools/DataStorage'
import { BigIntWithDecimals } from '../tools/bigIntWithDecimals'
import { createAmountConfig } from '../tools/extractPricesAndAmounts'
import type {
  AmountFormula,
  CalculationFormula,
  ProjectTvsConfig,
  TokenValue,
  ValueFormula,
} from '../types'

export class ValueService {
  constructor(private readonly storage: DataStorage) {}

  async calculate(
    config: ProjectTvsConfig,
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
          amount: Number(BigIntWithDecimals.toNumber(amount).toFixed(2)),
          value: Number(BigIntWithDecimals.toNumber(value).toFixed(2)),
          valueForProject: Number(
            BigIntWithDecimals.toNumber(valueForProject).toFixed(2),
          ),
          valueForTotal: Number(
            BigIntWithDecimals.toNumber(valueForTotal).toFixed(2),
          ),
        })
      }

      result.set(timestamp, values)
    }

    return await Promise.resolve(result)
  }

  private async executeAmountFormula(
    formula: AmountFormula,
    timestamp: UnixTime,
  ): Promise<BigIntWithDecimals> {
    if (formula.type === 'const') {
      return BigIntWithDecimals(BigInt(formula.value), formula.decimals)
    }

    const config = createAmountConfig(formula)
    const amount = await this.storage.getAmount(config.id, timestamp)
    assert(amount !== undefined, `${formula.type} ${config.id}`)
    return BigIntWithDecimals(amount, config.decimals)
  }

  private async executeValueFormula(
    formula: ValueFormula,
    timestamp: UnixTime,
  ): Promise<BigIntWithDecimals> {
    const price = await this.storage.getPrice(formula.priceId, timestamp)
    assert(price !== undefined, `Price not found for ${formula.priceId}`)

    const amount = await this.executeFormula(formula.amount, timestamp)
    const value = BigIntWithDecimals.multiply(
      amount,
      BigIntWithDecimals.fromNumber(price),
    )
    return value
  }

  private async executeFormula(
    formula: CalculationFormula | ValueFormula | AmountFormula,
    timestamp: UnixTime,
  ): Promise<BigIntWithDecimals> {
    const executeFormulaRecursive = async (
      formula: CalculationFormula | ValueFormula | AmountFormula,
      timestamp: UnixTime,
    ): Promise<BigIntWithDecimals> => {
      if (formula.type === 'value') {
        return await this.executeValueFormula(formula, timestamp)
      }

      if (formula.type === 'calculation') {
        return await formula.arguments.reduce(
          async (
            acc: Promise<BigIntWithDecimals>,
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
                return valueAcc > value ? valueAcc : value
              case 'min':
                return valueAcc < value ? valueAcc : value
            }
          },
          Promise.resolve(
            formula.operator === 'min' ? BigIntWithDecimals.MAX : 0n,
          ),
        )
      }

      return await this.executeAmountFormula(formula, timestamp)
    }

    return await executeFormulaRecursive(formula, timestamp)
  }
}
