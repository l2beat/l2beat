import type { Block, CountedBlock, StatResults } from '@/types'

export interface Counter {
  countForBlock(block: Block): Promise<CountedBlock>
  countForBlocks(blocks: Block[]): Promise<StatResults>
}
