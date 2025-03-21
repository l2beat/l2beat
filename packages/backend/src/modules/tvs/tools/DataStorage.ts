import type { UnixTime } from '@l2beat/shared-pure'

export interface DataStorage {
  getPrice(id: string, timestamp: UnixTime): Promise<number | undefined>
  getAmount(id: string, timestamp: UnixTime): Promise<bigint | undefined>
}
