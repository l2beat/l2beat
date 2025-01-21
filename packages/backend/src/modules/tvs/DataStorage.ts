import type { UnixTime } from '@l2beat/shared-pure'

export interface DataStorage {
  writePrice(id: string, timestamp: UnixTime, price: number): Promise<void>
  getPrice(id: string, timestamp: UnixTime): Promise<number>
  writeAmount(id: string, timestamp: UnixTime, amount: bigint): Promise<void>
  getAmount(id: string, timestamp: UnixTime): Promise<bigint>
}
