import type { UnixTime } from '@l2beat/shared-pure'

export interface DataStorage {
  getPrice(id: string, timestamp: UnixTime): number | undefined
  getAmount(id: string, timestamp: UnixTime): bigint | undefined
}
