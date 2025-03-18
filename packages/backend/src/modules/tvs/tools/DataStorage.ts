import type { UnixTime } from '@l2beat/shared-pure'

export interface DataStorage {
  writePrice(id: string, timestamp: UnixTime, price: number): Promise<void>
  getPrices(
    ids: string[],
    timestamps: UnixTime[],
  ): Promise<Map<UnixTime, Map<string, number>>>
  writeAmount(id: string, timestamp: UnixTime, amount: bigint): Promise<void>
  getAmounts(
    ids: string[],
    timestamps: UnixTime[],
  ): Promise<Map<UnixTime, Map<string, bigint>>>
}
