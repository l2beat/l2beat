import type { Logger } from '@l2beat/backend-tools'
import type {
  AmountFormula,
  CalculationFormula,
  ValueFormula,
} from '@l2beat/config'
import { assert, notUndefined, type UnixTime } from '@l2beat/shared-pure'
import { BigIntWithDecimals } from '../tools/bigIntWithDecimals'
import type { DataStorage } from '../tools/DataStorage'
import {
  createAmountConfig,
  createPriceConfigId,
} from '../tools/extractPricesAndAmounts'
import type { ProjectTvsConfig, TokenValue } from '../types'

export class ValueService {
  private logger: Logger
  constructor(
    private readonly storage: DataStorage,
    logger: Logger,
  ) {
    this.logger = logger.for(this)
  }

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

        const valueForSummary = token.valueForSummary
          ? await this.executeFormula(
              token.id,
              token.valueForSummary,
              timestamp,
            )
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
            BigIntWithDecimals.toNumber(valueForSummary).toFixed(2),
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

    if (
      timestamp < config.sinceTimestamp ||
      (config.untilTimestamp && timestamp > config.untilTimestamp)
    ) {
      return undefined
    }

    const amount = await this.storage.getAmount(config.id, timestamp)

    if (amount === undefined) {
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
    ): Promise<BigIntWithDecimals | undefined> => {
      if (formula.type === 'value') {
        return await this.executeValueFormula(tokenId, formula, timestamp)
      }

      if (formula.type === 'calculation') {
        const values: (bigint | undefined)[] = []
        for (const argument of formula.arguments) {
          const value = await executeFormulaRecursive(
            tokenId,
            argument,
            timestamp,
          )
          values.push(value)
        }

        const definedValues = values.filter(notUndefined)

        if (definedValues.length === 0) {
          throw new Error('All values undefined')
        }

        switch (formula.operator) {
          case 'sum':
            return definedValues.reduce((val, acc) => (acc += val), 0n)
          // TODO: enforce by test somewhere, all have the same since timestamp
          case 'diff':
            if (values[0] !== undefined) {
              const subtractFrom = values[0]
              const toSubtract = values
                .slice(1)
                .filter(notUndefined)
                .reduce((val, acc) => (acc += val), 0n)

              const result = subtractFrom - toSubtract

              if (result < 0n) {
                this.logger.warn('Diff returned less than zero', { tokenId })
                return 0n
              }

              return result
            }

            throw new Error('First argument of diff cannot be undefined')
          case 'max':
            return definedValues.reduce(
              (val, acc) => (val > acc ? val : acc),
              0n,
            )
          case 'min':
            return definedValues.reduce(
              (val, acc) => (val < acc ? val : acc),
              BigIntWithDecimals.MAX,
            )
        }
      }

      return await this.executeAmountFormula(tokenId, formula, timestamp)
    }

    return (await executeFormulaRecursive(tokenId, formula, timestamp)) ?? 0n
  }
}
