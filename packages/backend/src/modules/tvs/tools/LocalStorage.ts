import { existsSync, readFileSync, writeFileSync } from 'fs'
import type { UnixTime } from '@l2beat/shared-pure'
import type { DataStorage } from './DataStorage'

interface LocalStorageJSON {
  prices: Record<string, number>
  amounts: Record<string, string>
  blocks: Record<string, number>
}

export class LocalStorage implements DataStorage {
  private prices: Map<string, number>
  private amounts: Map<string, string>
  private blocks: Map<string, number>

  constructor(private readonly filePath: string) {
    const { amounts, prices, blocks } = this.readLocalFile()
    this.prices = prices
    this.amounts = amounts
    this.blocks = blocks
  }

  async getPrices(
    ids: string[],
    timestamps: UnixTime[],
  ): Promise<Map<UnixTime, Map<string, number>>> {
    const result = new Map<UnixTime, Map<string, number>>()

    for (const timestamp of timestamps) {
      const perTimestamp = new Map<string, number>()
      for (const id of ids) {
        const price = this.prices.get(key(id, timestamp))
        if (price) {
          perTimestamp.set(id, price)
        }
      }
      result.set(timestamp, perTimestamp)
    }

    return await Promise.resolve(result)
  }

  async getAmounts(
    ids: string[],
    timestamps: UnixTime[],
  ): Promise<Map<UnixTime, Map<string, bigint>>> {
    const result = new Map<UnixTime, Map<string, bigint>>()

    for (const timestamp of timestamps) {
      const perTimestamp = new Map<string, bigint>()
      for (const id of ids) {
        const amount = this.amounts.get(key(id, timestamp))
        if (amount) {
          perTimestamp.set(id, BigInt(amount))
        }
      }
      result.set(timestamp, perTimestamp)
    }

    return await Promise.resolve(result)
  }

  async writePrice(
    id: string,
    timestamp: UnixTime,
    price: number,
  ): Promise<void> {
    this.prices.set(key(id, timestamp), price)
    this.saveToFile()
    return await Promise.resolve()
  }

  async getPrice(id: string, timestamp: UnixTime): Promise<number | undefined> {
    const price = this.prices.get(key(id, timestamp))

    return await Promise.resolve(price)
  }

  async writeAmount(
    id: string,
    timestamp: UnixTime,
    amount: bigint,
  ): Promise<void> {
    this.amounts.set(key(id, timestamp), amount.toString())
    this.saveToFile()
    return await Promise.resolve()
  }

  async getAmount(
    id: string,
    timestamp: UnixTime,
  ): Promise<bigint | undefined> {
    const amount = this.amounts.get(key(id, timestamp))

    return await Promise.resolve(amount ? BigInt(amount) : undefined)
  }

  async writeBlockNumber(
    chain: string,
    timestamp: UnixTime,
    blockNumber: number,
  ) {
    this.blocks.set(key(chain, timestamp), blockNumber)
    this.saveToFile()
    return await Promise.resolve()
  }

  async getBlockNumber(chain: string, timestamp: UnixTime) {
    const block = this.blocks.get(key(chain, timestamp))

    return await Promise.resolve(block)
  }

  private readLocalFile() {
    if (existsSync(this.filePath)) {
      const data = JSON.parse(
        readFileSync(this.filePath, 'utf8'),
      ) as LocalStorageJSON
      return {
        prices: new Map(
          Object.entries(data.prices).map(([k, v]) => [k, Number(v)]),
        ),
        amounts: new Map(Object.entries(data.amounts).map(([k, v]) => [k, v])),
        blocks: new Map(
          Object.entries(data.blocks).map(([k, v]) => [k, Number(v)]),
        ),
      }
    } else {
      return {
        prices: new Map(),
        amounts: new Map(),
        blocks: new Map(),
      }
    }
  }

  private saveToFile() {
    const data = {
      prices: Object.fromEntries(this.prices),
      amounts: Object.fromEntries(
        Array.from(this.amounts.entries()).map(([k, v]) => [k, v]),
      ),
      blocks: Object.fromEntries(
        Array.from(this.blocks.entries()).map(([k, v]) => [k, v.toString()]),
      ),
    }
    writeFileSync(this.filePath, JSON.stringify(data, null, 2))
  }
}

export function key(id: string, timestamp: UnixTime): string {
  return `${id}-${timestamp}`
}
