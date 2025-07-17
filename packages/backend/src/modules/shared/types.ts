import type { Block, Log } from '@l2beat/shared-pure'

export interface BlockProcessor {
  init(): Promise<void>
  processBlock(block: Block, logs: Log[]): Promise<void>
}
