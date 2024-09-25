import type { Block, StatResults } from '@/types'

export interface Analyzer {
  getBlockNumber(): Promise<number>
  analyzeBlock(blockNumber: number): Promise<Block>
  analyzeBlocks(startBlock: number, count: number): Promise<StatResults>
}
