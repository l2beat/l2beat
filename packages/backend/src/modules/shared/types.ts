import type { Block } from '@l2beat/shared-pure'

export interface BlockProcessor {
  processBlock(block: Block): Promise<void>
}
