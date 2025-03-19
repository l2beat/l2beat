import { assert, type UnixTime } from '@l2beat/shared-pure'
import type { DataStorage } from '../tools/DataStorage'
import { BigIntWithDecimals } from '../tools/bigIntWithDecimals'
import {
  createAmountConfig,
  createPriceConfigId,
} from '../tools/extractPricesAndAmounts'
import type {
  AmountFormula,
  CalculationFormula,
  ProjectTvsConfig,
  TokenValue,
  ValueFormula,
} from '../types'

export class ValueService {
  constructor(private readonly storage: DataStorage) {}

  calculate(
    config: ProjectTvsConfig,
    timestamps: UnixTime[],
  ): Map<number, TokenValue[]> {
    const result = new Map<number, TokenValue[]>()

    for (const timestamp of timestamps) {
      const values: TokenValue[] = []

      for (const token of config.tokens) {
        const amount = this.executeFormula(token.amount, timestamp)
        const value = this.executeValueFormula(
          {
            type: 'value',
            amount: token.amount,
            priceId: token.priceId,
          },
          timestamp,
        )

        const valueForProject = token.valueForProject
          ? this.executeFormula(token.valueForProject, timestamp)
          : value

        const valueForTotal = token.valueForTotal
          ? this.executeFormula(token.valueForTotal, timestamp)
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

    return result
  }

  private executeAmountFormula(
    formula: AmountFormula,
    timestamp: UnixTime,
  ): BigIntWithDecimals {
    if (formula.type === 'const') {
      return BigIntWithDecimals(BigInt(formula.value), formula.decimals)
    }

    const config = createAmountConfig(formula)
    const amount = this.storage.getAmount(config.id, timestamp)
    assert(amount !== undefined, `${formula.type} ${config.id}`)
    return BigIntWithDecimals(amount, config.decimals)
  }

  private executeValueFormula(
    formula: ValueFormula,
    timestamp: UnixTime,
  ): BigIntWithDecimals {
    const configurationId = createPriceConfigId(formula.priceId)
    const price = this.storage.getPrice(configurationId, timestamp)
    assert(price !== undefined, `Price not found for ${formula.priceId}`)

    const amount = this.executeFormula(formula.amount, timestamp)
    const value = BigIntWithDecimals.multiply(
      amount,
      BigIntWithDecimals.fromNumber(price),
    )
    return value
  }

  private executeFormula(
    formula: CalculationFormula | ValueFormula | AmountFormula,
    timestamp: UnixTime,
  ): BigIntWithDecimals {
    const executeFormulaRecursive = (
      formula: CalculationFormula | ValueFormula | AmountFormula,
      timestamp: UnixTime,
    ): BigIntWithDecimals => {
      if (formula.type === 'value') {
        return this.executeValueFormula(formula, timestamp)
      }

      if (formula.type === 'calculation') {
        return formula.arguments.reduce(
          (
            acc: BigIntWithDecimals,
            current: CalculationFormula | ValueFormula | AmountFormula,
            index: number,
          ) => {
            const value = executeFormulaRecursive(current, timestamp)

            switch (formula.operator) {
              case 'sum':
                return acc + value
              case 'diff':
                return index === 0 ? value : acc - value
              case 'max':
                return acc > value ? acc : value
              case 'min':
                return acc < value ? acc : value
            }
          },
          formula.operator === 'min' ? BigIntWithDecimals.MAX : 0n,
        )
      }

      return this.executeAmountFormula(formula, timestamp)
    }

    return executeFormulaRecursive(formula, timestamp)
  }
}
