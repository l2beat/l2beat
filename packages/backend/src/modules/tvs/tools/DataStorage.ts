import type { UnixTime } from '@l2beat/shared-pure'

export interface DataStorage {
  getPrices(
    ids: string[],
    timestamps: UnixTime[],
  ): Promise<Map<UnixTime, Map<string, number>>>
  getAmounts(
    ids: string[],
    timestamps: UnixTime[],
  ): Promise<Map<UnixTime, Map<string, bigint>>>
}
