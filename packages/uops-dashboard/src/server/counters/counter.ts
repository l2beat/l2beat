import type { CountedBlock, StatResults } from '@/types'
import type { Block } from '@l2beat/shared-pure'

export interface Counter {
  countForBlock(block: Block): CountedBlock
  countForBlocks(blocks: Block[]): StatResults
}
