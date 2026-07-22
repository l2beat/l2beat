import type { UnixTime } from '@l2beat/shared-pure'

export interface ActivityBlock {
  number: number
  timestamp: UnixTime
  txsCount: number
  uopsCount: number | null
}

export interface ActivityBlockProvider {
  chain: string
  /** Returns blocks in ascending block-number order. */
  getBlocks(from: number, to: number): Promise<ActivityBlock[]>
}
