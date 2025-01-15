
import { ProjectId, UnixTime } from "@l2beat/shared-pure"
import { extractPricesAndAmounts } from "./mapConfig"
import { AmountConfig, Formula, PriceConfig, TvsConfig, isDataOperator } from "./types"


export class LocalExecutor {
  private readonly dataFormulaExecutor: DataFormulaExecutor
  private readonly valueService: ValueService

  constructor() {
    const storage = new LocalStorage()
    this.dataFormulaExecutor = new DataFormulaExecutor(storage)
    this.valueService = new ValueService(storage)
  }

  async run(config: TvsConfig, timestamps: UnixTime[]): Promise<Map<number, TokenValue[]>> {
    const { prices, amounts } = extractPricesAndAmounts(config)

    await this.dataFormulaExecutor.execute(prices, amounts, timestamps)

    return await this.valueService.calculate(config, timestamps)
  }
}

export class DataFormulaExecutor {
  constructor(private storage: DataStorage) { }

  /** Fetches data from APIs. Writes result to LocalStorage */
  async execute(prices: PriceConfig[], amounts: AmountConfig[], timestamps: UnixTime[]) {
    for (const timestamp of timestamps) {
      for (const amount of amounts) {
        const v = await this.fetchAmount(amount, timestamp)
        await this.storage.writeAmount(amount.id, timestamp, v)
      }

      for (const price of prices) {
        // TODO: PriceProvider which operates on tickers
        const v = await this.fetchPrice(price, timestamp)
        await this.storage.writePrice(price.id, timestamp, v)
      }
    }
  }

  fetchAmount(_config: AmountConfig, _timestamp: UnixTime): Promise<bigint> {
    throw new Error('Not implemented')

  }
  fetchPrice(_config: PriceConfig, _timestamp: UnixTime): Promise<number> {
    throw new Error('Not implemented')

  }
}

export interface DataStorage {
  writePrice(id: string, timestamp: UnixTime, price: number,): Promise<void>
  getPrice(id: string, timestamp: UnixTime): Promise<number>
  writeAmount(id: string, timestamp: UnixTime, amount: bigint,): Promise<void>
  getAmount(id: string, timestamp: UnixTime): Promise<bigint>
}

export class LocalStorage implements DataStorage {
  private readonly prices: Map<string, number>
  private readonly amounts: Map<string, bigint>

  constructor() {
    this.prices = new Map()
    this.amounts = new Map()
  }

  async writePrice(id: string, timestamp: UnixTime, price: number): Promise<void> {
    this.prices.set(key(id, timestamp), price)
    return await Promise.resolve()
  }

  async getPrice(id: string, timestamp: UnixTime): Promise<number> {
    const price = this.prices.get(key(id, timestamp))

    if (!price) {
      throw new Error(`Price with id ${id} not found`)
    }

    return await Promise.resolve(price)
  }

  async writeAmount(id: string, timestamp: UnixTime, amount: bigint): Promise<void> {
    this.amounts.set(key(id, timestamp), amount)
    return await Promise.resolve()
  }

  async getAmount(id: string, timestamp: UnixTime): Promise<bigint> {

    const amount = this.amounts.get(key(id, timestamp))

    if (!amount) {
      throw new Error(`Amount with id ${key(id, timestamp)} not found`)
    }

    return await Promise.resolve(amount)
  }
}

// TODO: change ValueService.calculate to return array of this, alongside tvs sum
export interface TokenValue {
  tokenId: string
  project: ProjectId
  valueUsd: number
}

export class ValueService {
  constructor(private readonly storage: DataStorage) { }

  /** Should return breakdow */
  async calculate(config: TvsConfig, timestamps: UnixTime[]): Promise<Map<number, TokenValue[]>> {
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
          valueUsd
        })
      }

      result.set(timestamp.toNumber(), values)
    }

    return await Promise.resolve(result)
  }

  async executeFormula(_formula: Formula, _timestamp: UnixTime): Promise<bigint> {
    return await Promise.resolve(BigInt(0))
  }
}

export function key(id: string, timestamp: UnixTime): string {
  return `${id}-${timestamp.toNumber()}`
}