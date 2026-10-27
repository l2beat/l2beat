import type { Block } from '@l2beat/shared-pure'
import type { CountedBlock, StatResults } from '../types'

export interface Counter {
  countForBlock(block: Block): CountedBlock
  countForBlocks(blocks: Block[]): StatResults
}

export function getOperationsRatio(
  operationsCount: number,
  transactionsCount: number,
): number {
  return transactionsCount === 0 ? 0 : operationsCount / transactionsCount
}
