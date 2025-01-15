import { UnixTime } from '@l2beat/shared-pure'
import { DataStorage } from './DataStorage'

export class LocalStorage implements DataStorage {
  private readonly prices: Map<string, number>
  private readonly amounts: Map<string, bigint>

  constructor() {
    this.prices = new Map()
    this.amounts = new Map()
  }

  async writePrice(
    id: string,
    timestamp: UnixTime,
    price: number,
  ): Promise<void> {
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

  async writeAmount(
    id: string,
    timestamp: UnixTime,
    amount: bigint,
  ): Promise<void> {
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

export function key(id: string, timestamp: UnixTime): string {
  return `${id}-${timestamp.toNumber()}`
}
