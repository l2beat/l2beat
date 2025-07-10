import type { Block, Log } from '@l2beat/shared-pure'

export interface BlockProcessor {
  processBlock(block: Block, logs: Log[]): Promise<void>
}
