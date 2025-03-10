import type { UnixTime } from '@l2beat/shared-pure'

export interface DataStorage {
  writePrice(id: string, timestamp: UnixTime, price: number): Promise<void>
  getPrice(id: string, timestamp: UnixTime): Promise<number | undefined>
  writeAmount(id: string, timestamp: UnixTime, amount: bigint): Promise<void>
  getAmount(id: string, timestamp: UnixTime): Promise<bigint | undefined>
  writeBlockNumber(
    chain: string,
    timestamp: UnixTime,
    blockNumber: number,
  ): Promise<void>
  getBlockNumber(
    chain: string,
    timestamp: UnixTime,
  ): Promise<number | undefined>
}
