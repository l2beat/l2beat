import type { UnixTime } from '@l2beat/shared-pure'
import type { BlockProcessor } from '../../../types'

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
  /** Lets the provider reuse blocks that block sync fetches anyway. */
  blockObserver?: BlockProcessor
}
