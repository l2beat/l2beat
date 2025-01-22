import type { UnixTime } from '@l2beat/shared-pure'
import type { DataStorage } from './DataStorage'
import type {
  AmountFormula,
  Formula,
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
          : undefined

        const valueForTotal = token.valueForTotal
          ? await this.executeFormula(token.valueForTotal, timestamp)
          : undefined

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

  async executeAmountFormula(
    _formula: AmountFormula,
    timestamp: UnixTime,
  ): Promise<bigint> {
    //TODO: replace with function that generates configId from formula
    const amount = this.storage.getAmount('configId', timestamp)
    return await Promise.resolve(amount)
  }

  async executeValueFormula(
    formula: ValueFormula,
    timestamp: UnixTime,
  ): Promise<number> {
    //TODO: replace with function that generates configId from ticker
    const price = await this.storage.getPrice('ticker', timestamp)
    const amount = await this.executeAmountFormula(formula.amount, timestamp)
    const value = Number(amount * BigInt(price))
    return value
  }

  async executeFormula(
    _formula: Formula,
    _timestamp: UnixTime,
  ): Promise<number> {
    // TODO implement
    return await Promise.resolve(0)
  }
}
