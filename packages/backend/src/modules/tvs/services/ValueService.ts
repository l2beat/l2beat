import { assert, type UnixTime } from '@l2beat/shared-pure'
import type { DataStorage } from '../tools/DataStorage'
import { BigIntWithDecimals } from '../tools/bigIntWithDecimals'
import {
  createAmountConfig,
  createPriceConfigId,
  extractPricesAndAmounts,
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

  async calculate(
    config: ProjectTvsConfig,
    timestamps: UnixTime[],
  ): Promise<Map<number, TokenValue[]>> {
    const result = new Map<number, TokenValue[]>()

    const { prices, amounts } = await this.getPricesAndAmounts(
      config,
      timestamps,
    )

    for (const timestamp of timestamps) {
      const values: TokenValue[] = []

      for (const token of config.tokens) {
        const amount = this.executeFormula(
          token.amount,
          timestamp,
          prices,
          amounts,
        )
        const value = this.executeValueFormula(
          {
            amount: token.amount,
            priceId: token.priceId,
          } as ValueFormula,
          timestamp,
          prices,
          amounts,
        )

        const valueForProject = token.valueForProject
          ? this.executeFormula(
              token.valueForProject,
              timestamp,
              prices,
              amounts,
            )
          : value

        const valueForTotal = token.valueForTotal
          ? this.executeFormula(token.valueForTotal, timestamp, prices, amounts)
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

  private async getPricesAndAmounts(
    config: ProjectTvsConfig,
    timestamps: UnixTime[],
  ) {
    const { prices, amounts } = extractPricesAndAmounts(config)

    const priceRecords = await this.storage.getPrices(
      prices.map((p) => p.id),
      timestamps,
    )
    const amountRecords = await this.storage.getAmounts(
      amounts.map((a) => a.id),
      timestamps,
    )
    return { prices: priceRecords, amounts: amountRecords }
  }

  private executeAmountFormula(
    formula: AmountFormula,
    timestamp: UnixTime,
    amounts: Map<number, Map<string, bigint>>,
  ): BigIntWithDecimals {
    if (formula.type === 'const') {
      return BigIntWithDecimals(BigInt(formula.value), formula.decimals)
    }
    const config = createAmountConfig(formula)
    const amount = amounts.get(timestamp)?.get(config.id)
    assert(amount !== undefined, `${formula.type} ${config.id}`)
    return BigIntWithDecimals(amount, config.decimals)
  }

  private executeValueFormula(
    formula: ValueFormula,
    timestamp: UnixTime,
    prices: Map<number, Map<string, number>>,
    amounts: Map<number, Map<string, bigint>>,
  ): BigIntWithDecimals {
    const configurationId = createPriceConfigId(formula.priceId)
    const price = prices.get(timestamp)?.get(configurationId)
    assert(price !== undefined, `Price not found for ${formula.priceId}`)

    const amount = this.executeFormula(
      formula.amount,
      timestamp,
      prices,
      amounts,
    )
    const value = BigIntWithDecimals.multiply(
      amount,
      BigIntWithDecimals.fromNumber(price),
    )
    return value
  }

  private executeFormula(
    formula: CalculationFormula | ValueFormula | AmountFormula,
    timestamp: UnixTime,
    prices: Map<number, Map<string, number>>,
    amounts: Map<number, Map<string, bigint>>,
  ): BigIntWithDecimals {
    const executeFormulaRecursive = (
      formula: CalculationFormula | ValueFormula | AmountFormula,
      timestamp: UnixTime,
    ): BigIntWithDecimals => {
      if (formula.type === 'value') {
        return this.executeValueFormula(formula, timestamp, prices, amounts)
      }

      if (formula.type === 'calculation') {
        return formula.arguments.reduce(
          (
            acc: BigIntWithDecimals,
            current: CalculationFormula | ValueFormula | AmountFormula,
            index: number,
          ) => {
            const valueAcc = acc
            const value = executeFormulaRecursive(current, timestamp)

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
          formula.operator === 'min' ? BigIntWithDecimals.MAX : 0n,
        )
      }

      return this.executeAmountFormula(formula, timestamp, amounts)
    }

    return executeFormulaRecursive(formula, timestamp)
  }
}
