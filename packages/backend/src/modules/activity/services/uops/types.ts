import { Block } from '@l2beat/shared-pure'

export interface AnalyzedBlock {
  transactionsLength: number
  uopsLength: number
}

export interface Analyzer {
  analyzeBlock(block: Block): AnalyzedBlock
}
