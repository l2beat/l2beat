import type { CountedBlock, StatResults } from '@/types'
import { Block } from '@l2beat/shared'

export interface Counter {
  countForBlock(block: Block): CountedBlock
  countForBlocks(blocks: Block[]): StatResults
}
