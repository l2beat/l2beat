import type {
  AmountFormula,
  CalculationFormula,
  ValueFormula,
} from '@l2beat/config'
import { assert, type UnixTime } from '@l2beat/shared-pure'
import type { DataStorage } from '../tools/DataStorage'
import { BigIntWithDecimals } from '../tools/bigIntWithDecimals'
import {
  createAmountConfig,
  createPriceConfigId,
} from '../tools/extractPricesAndAmounts'
import type { ProjectTvsConfig, TokenValue } from '../types'

export class ValueService {
  constructor(private readonly storage: DataStorage) {}

  async calculate(
    config: ProjectTvsConfig,
    timestamps: UnixTime[],
  ): Promise<TokenValue[]> {
    const result = new Map<number, TokenValue[]>()

    for (const timestamp of timestamps) {
      const values: TokenValue[] = []

      for (const token of config.tokens) {
        const amount = await this.executeFormula(
          token.id,
          token.amount,
          timestamp,
        )
        const value = await this.executeValueFormula(
          token.id,
          {
            amount: token.amount,
            priceId: token.priceId,
          } as ValueFormula,
          timestamp,
        )

        const valueForProject = token.valueForProject
          ? await this.executeFormula(
              token.id,
              token.valueForProject,
              timestamp,
            )
          : value

        const valueForTotal = token.valueForTotal
          ? await this.executeFormula(token.id, token.valueForTotal, timestamp)
          : (valueForProject ?? value)

        values.push({
          tokenId: token.id,
          projectId: config.projectId,
          timestamp,
          amount: Number(BigIntWithDecimals.toNumber(amount).toFixed(2)),
          value: Number(BigIntWithDecimals.toNumber(value).toFixed(2)),
          valueForProject: Number(
            BigIntWithDecimals.toNumber(valueForProject).toFixed(2),
          ),
          valueForSummary: Number(
            BigIntWithDecimals.toNumber(valueForTotal).toFixed(2),
          ),
        })
      }

      result.set(timestamp, values)
    }

    return [...result.values()].flat()
  }

  private async executeAmountFormula(
    tokenId: string,
    formula: AmountFormula,
    timestamp: UnixTime,
  ): Promise<BigIntWithDecimals | undefined> {
    if (formula.type === 'const') {
      return BigIntWithDecimals(BigInt(formula.value), formula.decimals)
    }

    const config = createAmountConfig(formula)
    const amount = await this.storage.getAmount(config.id, timestamp)

    if (amount === undefined) {
      if (
        timestamp < config.sinceTimestamp ||
        (config.untilTimestamp && timestamp > config.untilTimestamp)
      ) {
        return undefined
      }

      throw new Error(
        `${tokenId}: Amount not found for ${config.id} within configured range (timestamp: ${timestamp}, since: ${config.sinceTimestamp}, until: ${config.untilTimestamp})`,
      )
    }

    return BigIntWithDecimals(amount, config.decimals)
  }

  private async executeValueFormula(
    tokenId: string,
    formula: ValueFormula,
    timestamp: UnixTime,
  ): Promise<BigIntWithDecimals> {
    const configurationId = createPriceConfigId(formula.priceId)
    const price = await this.storage.getPrice(configurationId, timestamp)

    assert(
      price !== undefined,
      `${tokenId}: Price not found for ${formula.priceId} at ${timestamp}`,
    )

    const amount = await this.executeFormula(tokenId, formula.amount, timestamp)
    const value = BigIntWithDecimals.multiply(
      amount,
      BigIntWithDecimals.fromNumber(price),
    )
    return value
  }

  private async executeFormula(
    tokenId: string,
    formula: CalculationFormula | ValueFormula | AmountFormula,
    timestamp: UnixTime,
  ): Promise<BigIntWithDecimals> {
    const executeFormulaRecursive = async (
      tokenId: string,
      formula: CalculationFormula | ValueFormula | AmountFormula,
      timestamp: UnixTime,
    ): Promise<BigIntWithDecimals> => {
      if (formula.type === 'value') {
        return await this.executeValueFormula(tokenId, formula, timestamp)
      }

      if (formula.type === 'calculation') {
        return await formula.arguments.reduce(
          async (
            acc: Promise<BigIntWithDecimals>,
            current: CalculationFormula | ValueFormula | AmountFormula,
            index: number,
          ) => {
            const valueAcc = await acc
            const value = await executeFormulaRecursive(
              tokenId,
              current,
              timestamp,
            )

            switch (formula.operator) {
              case 'sum':
                return valueAcc + (value ?? 0n)
              case 'diff':
                return index === 0 ? value : valueAcc - (value ?? 0n)
              case 'max':
                return value ? (valueAcc > value ? valueAcc : value) : valueAcc
              case 'min':
                return value ? (valueAcc < value ? valueAcc : value) : valueAcc
            }
          },
          Promise.resolve(
            formula.operator === 'min' ? BigIntWithDecimals.MAX : 0n,
          ),
        )
      }

      return (
        (await this.executeAmountFormula(tokenId, formula, timestamp)) ?? 0n
      )
    }

    return await executeFormulaRecursive(tokenId, formula, timestamp)
  }
}
