import type { Block } from '@l2beat/shared-pure'

export interface UopsAnalyzer {
  calculateUops(block: Block): number
}
