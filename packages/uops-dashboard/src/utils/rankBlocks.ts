import type { BlockRatio } from '@/types'

export function rankBlocks(a: BlockRatio, b: BlockRatio): number {
  if (a.includesUnknown !== b.includesUnknown) {
    return a.includesUnknown ? -1 : 1
  }

  if (a.includesBatch !== b.includesBatch) {
    return a.includesBatch ? -1 : 1
  }

  return b.ratio - a.ratio
}
