import { existsSync, readFileSync, writeFileSync } from 'fs'
import type { UnixTime } from '@l2beat/shared-pure'
import type { DataStorage } from './DataStorage'

interface LocalStorageJSON {
  prices: Record<string, number>
  amounts: Record<string, bigint>
}

export class LocalStorage implements DataStorage {
  private prices: Map<string, number>
  private amounts: Map<string, bigint>

  constructor(private readonly filePath: string) {
    const { amounts, prices } = this.readLocalFile()
    this.prices = prices
    this.amounts = amounts
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

  async getPrice(id: string, timestamp: UnixTime): Promise<number> {
    const price = this.prices.get(key(id, timestamp))

    if (!price) {
      throw new Error(`Price with id ${id} not found`)
    }

    return await Promise.resolve(price)
  }

  async writeAmount(
    id: string,
    timestamp: UnixTime,
    amount: bigint,
  ): Promise<void> {
    this.amounts.set(key(id, timestamp), amount)
    this.saveToFile()
    return await Promise.resolve()
  }

  async getAmount(id: string, timestamp: UnixTime): Promise<bigint> {
    const amount = this.amounts.get(key(id, timestamp))

    if (!amount) {
      throw new Error(`Amount with id ${key(id, timestamp)} not found`)
    }

    return await Promise.resolve(amount)
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
        amounts: new Map(
          Object.entries(data.amounts).map(([k, v]) => [k, BigInt(v)]),
        ),
      }
    } else {
      return {
        prices: new Map(),
        amounts: new Map(),
      }
    }
  }

  private saveToFile() {
    const data = {
      prices: Object.fromEntries(this.prices),
      amounts: Object.fromEntries(
        Array.from(this.amounts.entries()).map(([k, v]) => [k, v.toString()]),
      ),
    }
    writeFileSync(this.filePath, JSON.stringify(data, null, 2))
  }
}

export function key(id: string, timestamp: UnixTime): string {
  return `${id}-${timestamp.toNumber()}`
}
