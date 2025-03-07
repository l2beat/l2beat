import { assert, type UnixTime } from '@l2beat/shared-pure'
import type { DataStorage } from './DataStorage'
import { createAmountConfig } from './mapConfig'
import type {
  AmountFormula,
  CalculationFormula,
  TokenValue,
  TvsConfig,
  ValueFormula,
} from './types'

const DECIMALS = 2

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
          amount: bigintToNumber(amount),
          value: bigintToNumber(value),
          valueForProject: bigintToNumber(valueForProject),
          valueForTotal: bigintToNumber(valueForTotal),
        })
      }

      result.set(timestamp, values)
    }

    return await Promise.resolve(result)
  }

  private async executeAmountFormula(
    formula: AmountFormula,
    timestamp: UnixTime,
  ): Promise<bigint> {
    if (formula.type === 'const') {
      return matchDecimals(BigInt(formula.value), formula.decimals)
    }

    const config = createAmountConfig(formula)
    const amount = await this.storage.getAmount(config.id, timestamp)
    assert(amount !== undefined, `${formula.type} ${config.id}`)
    return matchDecimals(amount, config.decimals)
  }

  private async executeValueFormula(
    formula: ValueFormula,
    timestamp: UnixTime,
  ): Promise<bigint> {
    const price = await this.storage.getPrice(formula.priceId, timestamp)
    assert(price !== undefined, `Price not found for ${formula.priceId}`)

    const amount = await this.executeFormula(formula.amount, timestamp)
    const value = (amount * numberToBigInt(price)) / BigInt(10 ** DECIMALS)
    return value
  }

  private async executeFormula(
    formula: CalculationFormula | ValueFormula | AmountFormula,
    timestamp: UnixTime,
  ): Promise<bigint> {
    const executeFormulaRecursive = async (
      formula: CalculationFormula | ValueFormula | AmountFormula,
      timestamp: UnixTime,
    ): Promise<bigint> => {
      if (formula.type === 'value') {
        return await this.executeValueFormula(formula, timestamp)
      }

      if (formula.type === 'calculation') {
        return await formula.arguments.reduce(
          async (
            acc: Promise<bigint>,
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
          Promise.resolve(formula.operator === 'min' ? BigInt(2n ** 256n) : 0n),
        )
      }

      return await this.executeAmountFormula(formula, timestamp)
    }

    return await executeFormulaRecursive(formula, timestamp)
  }
}

function numberToBigInt(value: number): bigint {
  return BigInt(Math.round(value * 10 ** DECIMALS))
}

function bigintToNumber(value: bigint): number {
  return Number(value) / 10 ** DECIMALS
}

function matchDecimals(value: bigint, decimals: number): bigint {
  assert(decimals >= 0, 'Decimals must be non-negative')

  if (decimals === DECIMALS) {
    return value
  }

  if (decimals > DECIMALS) {
    return value / BigInt(10 ** (decimals - DECIMALS))
  }

  return value * BigInt(10 ** (DECIMALS - decimals))
}
