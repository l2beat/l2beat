import { UnixTime } from '@l2beat/shared-pure'
import { DataStorage } from './DataStorage'
import { Formula, TokenValue, TvsConfig, isDataOperator } from './types'

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
        let amount = 0n
        if (isDataOperator(token.amount.operator)) {
          amount = await this.storage.getAmount(token.id, timestamp)
        } else {
          amount = await this.executeFormula(token.amount, timestamp)
        }

        const price = await this.storage.getPrice(token.id, timestamp)

        const valueUsd = Number(amount * BigInt(price)) // transform bigint into dollars with cents

        values.push({
          tokenId: token.id,
          project: config.project,
          valueUsd,
        })
      }

      result.set(timestamp.toNumber(), values)
    }

    return await Promise.resolve(result)
  }

  async executeFormula(
    _formula: Formula,
    _timestamp: UnixTime,
  ): Promise<bigint> {
    return await Promise.resolve(BigInt(0))
  }
}
